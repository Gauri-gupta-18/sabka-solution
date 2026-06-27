"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Brain, TrendingUp } from "lucide-react";

const trendData = [
  { name: "Jan", issues: 120, resolved: 90 },
  { name: "Feb", issues: 150, resolved: 110 },
  { name: "Mar", issues: 180, resolved: 140 },
  { name: "Apr", issues: 220, resolved: 190 },
  { name: "May", issues: 250, resolved: 210 },
  { name: "Jun", issues: 280, resolved: 250 },
];

const categoryData = [
  { name: "Roads", value: 400, color: "#3B82F6" },
  { name: "Sanitation", value: 300, color: "#10B981" },
  { name: "Electricity", value: 300, color: "#F59E0B" },
  { name: "Water", value: 200, color: "#EF4444" },
];

export default function Analytics() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'Authority' && user.role !== 'Admin' && user.role !== 'Super Admin'))) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform performance, department efficiency, and AI predictions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Resolution Trends</CardTitle>
            <CardDescription>Issues reported vs resolved over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="issues" name="Reported" stroke="#94A3B8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Distribution of issues by department</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="h-5 w-5" />
              AI Predictions & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Upcoming Surge Prediction
                </h4>
                <p className="text-sm text-slate-600">
                  Based on historical weather data and recent reports, expect a <strong>35% increase</strong> in pothole-related issues over the next two weeks due to incoming monsoons.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Action</div>
                <p className="text-sm text-slate-800 font-medium">
                  Pre-allocate 2 additional maintenance crews to the South Zone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
