"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle2, 
  Award, 
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  const isAuthority = user.role === 'Authority' || user.role === 'Admin' || user.role === 'Super Admin';

  const citizenStats = [
    { title: "Reports Submitted", value: "24", icon: <FileText className="h-5 w-5 text-primary" /> },
    { title: "Issues Resolved", value: "18", icon: <CheckCircle2 className="h-5 w-5 text-secondary" /> },
    { title: "Trust Score", value: "860", icon: <Award className="h-5 w-5 text-amber-500" /> },
    { title: "Citizen Rank", value: "Top 12%", icon: <TrendingUp className="h-5 w-5 text-emerald-600" /> },
  ];

  const authorityStats = [
    { title: "Active Issues", value: "1,432", icon: <AlertTriangle className="h-5 w-5 text-amber-500" /> },
    { title: "Critical Alerts", value: "42", icon: <AlertTriangle className="h-5 w-5 text-destructive" /> },
    { title: "Avg. Resolution", value: "3.2 Days", icon: <Clock className="h-5 w-5 text-primary" /> },
    { title: "Resolved This Week", value: "384", icon: <CheckCircle2 className="h-5 w-5 text-secondary" /> },
  ];

  const stats = isAuthority ? authorityStats : citizenStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.displayName}. Here's what's happening.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-xl">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(46,207,143,0.5)]" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isAuthority ? "New high priority issue reported" : "Your report 'Broken Streetlight' was verified"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item * 2} hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{isAuthority ? "Department Load" : "Your Achievements"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthority ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium">Roads</div>
                  <div className="flex-1 h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-full w-[70%]" />
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">70%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium">Sanitation</div>
                  <div className="flex-1 h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]" />
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">45%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm font-medium">Electricity</div>
                  <div className="flex-1 h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[30%]" />
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">30%</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-amber-200">
                  <Award size={16} /> First Report
                </div>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
                  <ShieldCheck size={16} /> Verifier
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm font-semibold border border-secondary/20">
                  <CheckCircle2 size={16} /> 10 Resolved
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
