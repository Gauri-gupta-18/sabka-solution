"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Issue } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import the map component with SSR disabled
const IssueMap = dynamic(() => import("@/components/map/IssueMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">
      <div className="flex flex-col items-center text-slate-400">
        <MapPin className="h-8 w-8 mb-2" />
        <p className="font-medium">Loading Map...</p>
      </div>
    </div>
  )
});

export default function DashboardMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"), limit(50));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Issue[];
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues for map:", error);
        
        // Removed mock data fallback so only real issues show up.
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = filter === "All" ? issues : issues.filter(i => i.status === filter);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interactive Map</h1>
          <p className="text-muted-foreground mt-1">
            Explore civic issues reported in your city in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <Button 
              key={f} 
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="text-xs h-8"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden shadow-sm border border-border">
        {/* We use a wrapper div with absolute positioning to ensure the map fills the space correctly without causing layout jumps */}
        <div className="absolute inset-0">
          <IssueMap issues={filteredIssues} />
        </div>
        
        {/* Overlay Legend */}
        <div className="absolute bottom-6 left-6 z-[400]">
          <Card className="shadow-lg border-white/20 bg-white/90 backdrop-blur-md">
            <CardContent className="p-4">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                <Brain className="w-3 h-3" /> AI Priority
              </h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Critical
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div> High
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div> Medium
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div> Low
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
