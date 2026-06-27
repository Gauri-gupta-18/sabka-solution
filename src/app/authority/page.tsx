"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, MapPin, ListTodo } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AuthorityDashboard() {
  const stats = [
    {
      title: "Active Issues",
      value: "1,432",
      icon: ListTodo,
      trend: "-12 from last week",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Critical Alerts",
      value: "42",
      icon: AlertCircle,
      trend: "+5 new today",
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      title: "Avg Resolution",
      value: "3.2 Days",
      icon: Clock,
      trend: "Improved by 12%",
      color: "text-success",
      bg: "bg-success/10"
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">City Overview</h2>
          <p className="text-muted-foreground">Monitor and manage civic issues across all districts.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="h-full border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Urgent Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "ISS-4921", title: "Water Main Break", location: "Downtown Sector 4", severity: "High" },
                  { id: "ISS-4918", title: "Fallen Tree on Powerline", location: "North Hills", severity: "High" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{item.title}</span>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="h-full border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-primary" />
                Department Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Public Works (Potholes, Roads)</span>
                    <span>84% Resolved</span>
                  </div>
                  <Progress value={84} className="h-2 bg-accent" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Sanitation (Waste, Debris)</span>
                    <span>62% Resolved</span>
                  </div>
                  <Progress value={62} className="h-2 bg-accent" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Utilities (Water, Power)</span>
                    <span>91% Resolved</span>
                  </div>
                  <Progress value={91} className="h-2 bg-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
