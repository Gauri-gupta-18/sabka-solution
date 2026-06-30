"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ChevronRight, ShieldAlert, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
  Resolved: "bg-success",
  "In Progress": "bg-primary",
  Pending: "bg-warning",
  Verified: "bg-teal-500",
  Rejected: "bg-destructive",
  "Under Review": "bg-emerald-600",
  Assigned: "bg-blue-500",
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  Resolved: "success",
  Rejected: "destructive",
  Pending: "warning",
  "In Progress": "default",
};

function SkeletonCard() {
  return (
    <Card className="shadow-sm border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-28 animate-pulse">
          <div className="w-full md:w-2 bg-slate-200" />
          <div className="flex-1 p-6 flex flex-col justify-center gap-3">
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
              <div className="h-5 w-24 bg-slate-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(createdAt: any): string {
  if (!createdAt) return "Recent";
  // Firestore Timestamp
  if (createdAt instanceof Timestamp) {
    return createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  // Plain Date or seconds object
  if (createdAt.seconds) {
    return new Date(createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  if (createdAt.toDate) {
    return createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  return new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyReports() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Real-time listener so reports appear immediately after submission
    const q = query(
      collection(db, "issues"),
      where("reportedBy", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Issue[];
        setIssues(data);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch my reports:", err);
        // Index may still be building – fall back to a simple unordered query
        const fallbackQ = query(
          collection(db, "issues"),
          where("reportedBy", "==", user.id)
        );
        const unsubFallback = onSnapshot(fallbackQ, (snap) => {
          const data = snap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() })) as Issue[];
          // Sort client-side
          data.sort((a, b) => {
            const aTime = (a.createdAt as any)?.seconds ?? (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
            const bTime = (b.createdAt as any)?.seconds ?? (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
            return bTime - aTime;
          });
          setIssues(data);
          setLoading(false);
        });
        return () => unsubFallback();
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of the civic issues you have reported.
          </p>
        </div>
        <Link href="/dashboard/report">
          <Button className="shrink-0">+ Report New Issue</Button>
        </Link>
      </motion.div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 text-destructive border border-destructive/30 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!loading && !error && issues.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="shadow-sm border-dashed bg-slate-50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary/10 p-4 rounded-full shadow-sm mb-5 ring-1 ring-primary/20">
                  <ShieldAlert className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm text-sm">
                  You haven't reported any civic issues yet. Be a proactive citizen and help improve your city!
                </p>
                <Link href="/dashboard/report">
                  <Button>Report an Issue</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issues list */}
      {!loading && issues.length > 0 && (
        <div className="grid gap-3">
          <AnimatePresence>
            {issues.map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
              >
                <Card className="shadow-sm border-border/50 hover:shadow-md transition-all duration-200 group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Status stripe */}
                      <div
                        className={`w-full md:w-1.5 shrink-0 ${statusColors[issue.status] ?? "bg-slate-300"}`}
                      />

                      <div className="flex-1 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant={statusBadgeVariant[issue.status] ?? "default"}
                              className="uppercase text-[10px] tracking-wider px-2 py-0.5"
                            >
                              {issue.status}
                            </Badge>
                            {issue.category && (
                              <Badge variant="outline" className="border-border uppercase text-[10px] px-2 py-0.5 text-slate-500">
                                {issue.category}
                              </Badge>
                            )}
                            {issue.aiAnalysis?.severity === "Critical" && (
                              <Badge variant="destructive" className="uppercase text-[10px] px-2 py-0.5">
                                Critical
                              </Badge>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                            {issue.title}
                          </h3>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[220px]">
                                {issue.location?.address || "Location not specified"}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 shrink-0" />
                              {formatDate(issue.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
                          <div className="flex-1 md:flex-none text-center px-3">
                            <div className="text-2xl font-bold text-slate-700">
                              {issue.verificationCount ?? 0}
                            </div>
                            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                              Verified
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="shrink-0 h-9 w-9 p-0 rounded-full bg-slate-50 hover:bg-primary/10 hover:text-primary"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
