"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Leaderboard() {
  const leaders = [
    { name: "Rahul S.", rank: 1, score: 1250, badge: "Sabka Hero", issues: 45 },
    { name: "Priya M.", rank: 2, score: 980, badge: "Community Guardian", issues: 32 },
    { name: "Amit K.", rank: 3, score: 850, badge: "Local Helper", issues: 28 },
    { name: "Sneha R.", rank: 4, score: 720, badge: "Local Helper", issues: 21 },
    { name: "Vikram T.", rank: 5, score: 650, badge: "New Member", issues: 15 },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <div className="bg-amber-100 text-amber-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Citizen Leaderboard</h1>
            <p className="text-lg text-slate-600">Recognizing the most active contributors in our community.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 grid grid-cols-12 gap-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2 md:col-span-1 text-center">Rank</div>
              <div className="col-span-6 md:col-span-5">Citizen</div>
              <div className="hidden md:block col-span-3 text-center">Badge</div>
              <div className="hidden md:block col-span-2 text-center">Issues</div>
              <div className="col-span-4 md:col-span-1 text-right">Score</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {leaders.map((leader, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-2 md:col-span-1 text-center">
                    {leader.rank === 1 ? <Medal className="h-8 w-8 text-amber-500 mx-auto" /> : 
                     leader.rank === 2 ? <Medal className="h-8 w-8 text-slate-400 mx-auto" /> : 
                     leader.rank === 3 ? <Medal className="h-8 w-8 text-amber-700 mx-auto" /> : 
                     <span className="text-xl font-bold text-slate-400">#{leader.rank}</span>}
                  </div>
                  <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-slate-200">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {leader.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-900">{leader.name}</div>
                      <div className="text-xs text-slate-500 md:hidden">{leader.badge}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex col-span-3 items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-primary border border-blue-100">
                      <Award size={14} />
                      {leader.badge}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2 text-center text-slate-600 font-medium">
                    {leader.issues}
                  </div>
                  <div className="col-span-4 md:col-span-1 text-right font-bold text-lg text-primary">
                    {leader.score}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
