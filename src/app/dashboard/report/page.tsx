"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MapPin, Brain, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { analyzeIssueDescription, AIAnalysisResult } from "@/services/ai";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportIssue() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!description || description.length < 10) return;
    setIsAnalyzing(true);
    const result = await analyzeIssueDescription(description);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !analysisResult) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "issues"), {
        title,
        description,
        location: {
          address,
          lat: 12.9716, // Mock coords
          lng: 77.5946, // Mock coords
        },
        category: analysisResult.category,
        priority: analysisResult.severity,
        status: "Pending",
        aiAnalysis: {
          category: analysisResult.category,
          severity: analysisResult.severity,
          confidence: analysisResult.confidence,
          duplicateCheck: false,
        },
        images: [],
        verificationCount: 0,
        reportedBy: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/my-reports");
    } catch (error) {
      console.error("Failed to submit issue", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground mt-1">
          Help us keep the city clean and safe. Fill out the details below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>Provide as much detail as possible to help authorities resolve it quickly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Large pothole on Main Street" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="Enter street address or landmark" 
                      className="pl-9"
                      required 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-primary"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || description.length < 10}
                    >
                      {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                      {isAnalyzing ? "Analyzing..." : "AI Auto-Analyze"}
                    </Button>
                  </div>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the issue in detail..." 
                    className="min-h-[120px]"
                    required 
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (analysisResult) setAnalysisResult(null); // Reset analysis if changed
                    }}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    Minimum 10 characters required for AI analysis.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Photo Evidence (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or MP4 (max. 10MB)</p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={!analysisResult || isSubmitting}>
                  {isSubmitting ? "Submitting..." : analysisResult ? "Submit Issue" : "Analyze first to submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-border/50 sticky top-24">
            <CardHeader className="bg-slate-50 border-b border-border/50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <Brain className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Analyzing description...</p>
                  </motion.div>
                ) : analysisResult ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase mb-1">Detected Category</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-slate-900">{analysisResult.category}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase mb-1">Severity</div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`h-4 w-4 ${
                          analysisResult.severity === 'Critical' ? 'text-destructive' :
                          analysisResult.severity === 'High' ? 'text-amber-500' :
                          analysisResult.severity === 'Medium' ? 'text-blue-500' : 'text-emerald-500'
                        }`} />
                        <span className="font-semibold text-slate-900">{analysisResult.severity}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase mb-1">Confidence Score</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${analysisResult.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-primary">{analysisResult.confidence}%</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-800">
                        <strong>AI Reasoning:</strong> {analysisResult.reasoning}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">
                      Write a description and click "AI Auto-Analyze" to categorize your report automatically.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
