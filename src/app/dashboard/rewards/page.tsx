"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Medal, ShieldCheck, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function MyRewards() {
  const { user } = useAuth();

  // Mocked stats tied to a generic UI (could be fetched from user document in a full implementation)
  const stats = {
    trustScore: 850,
    nextLevel: 1000,
    reportsSubmitted: 12,
    issuesVerified: 45,
    streak: 5,
    rank: "Silver Citizen"
  };

  const badges = [
    { name: "First Reporter", description: "Submitted your first civic issue", icon: <Award className="w-8 h-8 text-amber-500" />, unlocked: true },
    { name: "Eagle Eye", description: "Verified 10 issues correctly", icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, unlocked: true },
    { name: "Civic Champion", description: "Reached 1000 Trust Score", icon: <Trophy className="w-8 h-8 text-yellow-400" />, unlocked: false },
    { name: "Weekly Streak", description: "Active on the platform for 7 consecutive days", icon: <Flame className="w-8 h-8 text-orange-500" />, unlocked: false },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Rewards & Impact</h1>
        <p className="text-muted-foreground mt-1">
          Track your civic contributions and earn badges for making the city better.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <Card className="md:col-span-2 shadow-sm border-primary/20 bg-gradient-to-br from-primary/10 to-emerald-50 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 text-primary/10">
            <Trophy size={200} />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Current Rank</p>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                  <Medal className="w-8 h-8 text-slate-400" />
                  {stats.rank}
                </h2>
                <p className="text-slate-600">Keep verifying issues to reach Gold status!</p>
              </div>
              <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-primary/20 min-w-[200px]">
                <p className="text-sm font-medium text-slate-500 mb-1">Trust Score</p>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {stats.trustScore}
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Progress to Gold Citizen</span>
                <span>{stats.trustScore} / {stats.nextLevel} pts</span>
              </div>
              <Progress value={(stats.trustScore / stats.nextLevel) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow flex-1">
            <CardContent className="p-6 flex items-center gap-4 h-full">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Issues Verified</p>
                <p className="text-3xl font-bold text-slate-900">{stats.issuesVerified}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border hover:shadow-md transition-shadow flex-1">
            <CardContent className="p-6 flex items-center gap-4 h-full">
              <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Day Streak</p>
                <p className="text-3xl font-bold text-slate-900">{stats.streak}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="text-xl font-bold mb-6">Achievement Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`shadow-sm border-border/50 h-full transition-all ${badge.unlocked ? 'bg-white' : 'bg-slate-50 opacity-60 grayscale'}`}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full mb-4 ${badge.unlocked ? 'bg-amber-50 shadow-inner' : 'bg-slate-200'}`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{badge.name}</h4>
                  <p className="text-xs text-slate-500">{badge.description}</p>
                  
                  {!badge.unlocked && (
                    <div className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Locked
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
