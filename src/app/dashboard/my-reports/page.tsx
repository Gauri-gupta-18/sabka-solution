"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, ChevronRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MyReports() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIssues = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "issues"),
          where("reportedBy", "==", user.id),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Issue[];
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch my reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssues();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of the civic issues you have reported.
          </p>
        </div>
        <Link href="/dashboard/report">
          <Button>Report New Issue</Button>
        </Link>
      </div>

      {issues.length === 0 ? (
        <Card className="shadow-sm border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <ShieldAlert className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              You haven't reported any issues yet. Be a proactive citizen and help improve your city!
            </p>
            <Link href="/dashboard/report">
              <Button>Report an Issue</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue, idx) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status Indicator Sidebar */}
                    <div className={`w-full md:w-2 ${
                      issue.status === 'Resolved' ? 'bg-emerald-500' :
                      issue.status === 'In Progress' ? 'bg-blue-500' :
                      issue.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    
                    <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={issue.status === 'Resolved' ? 'secondary' : 'default'} className="uppercase text-[10px] px-2">
                            {issue.status}
                          </Badge>
                          <Badge variant="outline" className="border-border uppercase text-[10px] px-2 text-slate-500">
                            {issue.category}
                          </Badge>
                          {issue.aiAnalysis.severity === 'Critical' && (
                            <Badge variant="destructive" className="uppercase text-[10px] px-2">Critical</Badge>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {issue.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px]">{issue.location.address}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {issue.createdAt?.toDate ? issue.createdAt.toDate().toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-border">
                        <div className="flex-1 md:flex-none text-center px-4">
                          <div className="text-2xl font-bold text-slate-700">{issue.verificationCount}</div>
                          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Verifications</div>
                        </div>
                        <Button variant="ghost" className="shrink-0 h-10 w-10 p-0 rounded-full bg-slate-50 hover:bg-primary/10 hover:text-primary">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
