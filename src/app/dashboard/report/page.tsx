"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MapPin, Brain, ShieldAlert, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { analyzeIssueDescription, AIAnalysisResult } from "@/services/ai";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import MapPicker to prevent SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function ReportIssue() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const fetchAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
  }, []);

  const handleAddressBlur = async () => {
    if (!address) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoordinates({ lat, lng });
      }
    } catch (error) {
      console.error("Geocoding address failed", error);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          fetchAddressFromCoords(lat, lng);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not access your location. Please check your browser permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleMapLocationSelect = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    fetchAddressFromCoords(lat, lng);
  }, [fetchAddressFromCoords]);

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
    setSubmitError("");
    try {
      let imageUrl = "";
      if (imageFile) {
        const imageRef = ref(storage, `issues/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "issues"), {
        title,
        description,
        location: {
          address: address || "Location not specified",
          lat: coordinates?.lat ?? 28.6139,
          lng: coordinates?.lng ?? 77.2090,
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
        images: imageUrl ? [imageUrl] : [],
        verificationCount: 0,
        verifiedBy: [],
        reportedBy: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/my-reports");
    } catch (error: any) {
      console.error("Failed to submit issue", error);
      setSubmitError("Failed to submit your report. Please try again.");
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
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
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
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="location">Official Location</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                      className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                    >
                      {isLocating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <MapPin className="w-3 h-3 mr-1" />}
                      Use My Current Location
                    </Button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="Type official address or pick on map..." 
                      className="pl-9"
                      required 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={handleAddressBlur}
                    />
                  </div>
                  <div className="h-[200px] w-full rounded-md overflow-hidden border border-border">
                    <MapPicker onLocationSelect={handleMapLocationSelect} initialPosition={coordinates} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can type the address directly, click "Use My Current Location", or drop a pin on the map to get official coordinates.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-primary group relative"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || description.length < 10}
                    >
                      {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                      {isAnalyzing ? "Analyzing..." : "AI Auto-Analyze"}
                      
                      {/* Tooltip-like explanation */}
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Our AI helps authorities route this faster!
                      </span>
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
                  <p className="text-xs text-muted-foreground mb-2">
                    Attaching a clear photo helps other citizens verify your report and allows authorities to prepare the right equipment before arriving.
                  </p>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*,video/mp4" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {previewUrl ? (
                      <div className="relative w-full max-h-48 overflow-hidden rounded-md flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <p className="text-white text-sm font-medium">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or MP4 (max. 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-destructive font-medium bg-destructive/5 px-3 py-2 rounded-md border border-destructive/20">
                    {submitError}
                  </p>
                )}
                <Button type="submit" className="w-full h-11" disabled={!analysisResult || isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                  ) : analysisResult ? "Submit Issue" : "Analyze first to submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow sticky top-24">
            <CardHeader className="bg-slate-50 border-b border-border rounded-t-lg">
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
                          analysisResult.severity === 'Medium' ? 'text-primary' : 'text-secondary'
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

                    <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                      <p className="text-xs text-primary font-medium">
                        <strong className="font-bold">AI Reasoning:</strong> {analysisResult.reasoning}
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
