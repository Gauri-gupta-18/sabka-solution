"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const IssueMap = dynamic(() => import("@/components/map/IssueMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">
      <div className="flex flex-col items-center text-slate-400">
        <MapPin className="h-8 w-8 mb-2" />
        <p className="font-medium">Loading Public Map...</p>
      </div>
    </div>
  )
});

export default function TransparencyPortal() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"), limit(100));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Issue[];
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues for map:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Transparency Portal</h1>
            <p className="text-lg text-slate-600">
              Open access to civic data. See what issues have been reported, verified by the community, and resolved by the authorities in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Reports</div>
                  <div className="text-2xl font-bold">14,235</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-success/20 rounded-xl text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Resolved</div>
                  <div className="text-2xl font-bold">12,840</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verification Rate</div>
                  <div className="text-2xl font-bold">98%</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-teal-50 rounded-xl text-teal-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Resolution</div>
                  <div className="text-2xl font-bold">3.2 Days</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-border overflow-hidden">
            <CardHeader className="bg-white border-b border-border">
              <CardTitle>Live City Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[600px] relative">
              <IssueMap issues={issues} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
