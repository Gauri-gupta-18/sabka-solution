"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Filter, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ManageIssues() {
  const { user } = useAuth();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (user && user.role !== 'Authority' && user.role !== 'Admin' && user.role !== 'Super Admin') {
      router.push("/dashboard");
      return;
    }

    const fetchIssues = async () => {
      try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Issue[];
        setIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [user, router]);

  const updateStatus = async (issueId: string, newStatus: Issue['status']) => {
    try {
      await updateDoc(doc(db, "issues", issueId), {
        status: newStatus,
        updatedAt: new Date()
      });
      // Optimistic update
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredIssues = filter === "All" ? issues : issues.filter(i => i.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Issues</h1>
          <p className="text-muted-foreground mt-1">
            Review, assign, and update civic issues reported by citizens.
          </p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-border shadow-sm">
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <Button 
              key={f} 
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="text-xs h-8"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredIssues.map((issue, idx) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={issue.status === 'Resolved' ? 'secondary' : 'default'} className="uppercase text-[10px] px-2">
                      {issue.status}
                    </Badge>
                    <Badge variant="outline" className="border-border uppercase text-[10px] px-2 text-slate-500">
                      {issue.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 ml-2">
                      <ShieldAlert className={`w-3.5 h-3.5 ${
                        issue.priority === 'Critical' ? 'text-destructive' :
                        issue.priority === 'High' ? 'text-amber-500' :
                        issue.priority === 'Medium' ? 'text-blue-500' : 'text-emerald-500'
                      }`} />
                      {issue.priority} Priority
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{issue.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2 max-w-3xl">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[300px]">{issue.location.address}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {issue.createdAt?.toDate ? issue.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium text-xs">
                        {issue.verificationCount} Verifications
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-48 shrink-0">
                  {issue.status !== 'Resolved' && (
                    <Button 
                      onClick={() => updateStatus(issue.id, 'Resolved')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                    </Button>
                  )}
                  {issue.status === 'Pending' && (
                    <Button 
                      variant="outline"
                      onClick={() => updateStatus(issue.id, 'In Progress')}
                      className="w-full"
                    >
                      Start Progress
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl border border-border">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No issues found</h3>
            <p className="text-slate-500">There are no {filter.toLowerCase()} issues at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
