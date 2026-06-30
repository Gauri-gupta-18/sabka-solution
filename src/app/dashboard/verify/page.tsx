"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyIssues() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPendingIssues = async () => {
      try {
        const q = query(
          collection(db, "issues"),
          where("status", "==", "Pending"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Issue[];
        
        // Filter out issues reported by the user AND issues they have already verified
        const eligibleIssues = data.filter(issue => 
          issue.reportedBy !== user?.id && 
          (!issue.verifiedBy || !issue.verifiedBy.includes(user?.id || ""))
        );
        
        setIssues(eligibleIssues);
      } catch (error) {
        console.error("Error fetching issues to verify:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchPendingIssues();
    }
  }, [user]);

  const handleVerify = async (issueId: string) => {
    if (!user) return;
    setVerifying(issueId);
    try {
      const issueRef = doc(db, "issues", issueId);
      await updateDoc(issueRef, {
        verificationCount: increment(1),
        verifiedBy: arrayUnion(user.id)
      });
      
      setVerifiedIds(prev => new Set(prev).add(issueId));
      
      // We don't remove it from UI immediately to let them see success state
      setTimeout(() => {
        setIssues(prev => prev.filter(i => i.id !== issueId));
      }, 2000);
      
    } catch (error) {
      console.error("Error verifying issue:", error);
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verify Issues</h1>
        <p className="text-muted-foreground mt-1">
          Review reports from other citizens to help prioritize action by authorities. 
          By verifying real issues, you prevent spam and ensure city resources are directed where they matter most.
        </p>
      </div>

      {issues.length === 0 ? (
        <Card className="shadow-sm border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're all caught up!</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              There are no pending issues in your area that need verification right now. Check back later!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {issues.map((issue) => {
              const isVerified = verifiedIds.has(issue.id);
              return (
                <motion.div
                  key={issue.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`shadow-sm transition-all overflow-hidden border ${isVerified ? 'border-primary shadow-[0_0_15px_rgba(46,207,143,0.15)]' : 'border-border hover:shadow-md'}`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative">
                          {issue.images && issue.images.length > 0 ? (
                            <img src={issue.images[0]} alt="Issue Evidence" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <AlertTriangle className="w-10 h-10 mb-2 opacity-20" />
                              <span className="text-sm font-medium">No Image Provided</span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-0 shadow-sm">
                              {issue.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                {issue.title}
                              </h3>
                              <Badge variant={issue.priority === 'Critical' ? 'destructive' : 'secondary'}>
                                {issue.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                              {issue.description}
                            </p>
                            <div className="flex items-center text-sm text-slate-500 mb-6 gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {issue.location.address}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
                            <div className="text-sm text-slate-500">
                              <span className="font-semibold text-slate-700">{issue.verificationCount}</span> citizens verified this
                            </div>
                            {isVerified ? (
                              <Button disabled variant="outline" className="text-primary border-primary/30 bg-primary/5">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Verified
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleVerify(issue.id)}
                                disabled={verifying === issue.id}
                                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                              >
                                {verifying === issue.id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : (
                                  <ShieldCheck className="w-4 h-4 mr-2" />
                                )}
                                Verify Issue
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
