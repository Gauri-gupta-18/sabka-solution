"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Users, MapPin } from "lucide-react";

export default function Impact() {
  const stats = [
    { title: "Issues Resolved", value: "14,235", icon: <CheckCircle2 className="h-6 w-6 text-success" /> },
    { title: "Citizens Involved", value: "8,942", icon: <Users className="h-6 w-6 text-primary" /> },
    { title: "Cities Covered", value: "12", icon: <MapPin className="h-6 w-6 text-secondary" /> },
    { title: "Resolution Rate", value: "92%", icon: <TrendingUp className="h-6 w-6 text-primary" /> },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Impact</h1>
            <p className="text-lg text-slate-600">See the real difference we are making in our cities together.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-col items-center pb-2">
                    <div className="p-3 bg-slate-50 rounded-full mb-2">
                      {stat.icon}
                    </div>
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-slate-900">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Success Stories</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <Card key={item} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">Pothole fixed in 48 hours</h4>
                        <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Resolved</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        A major pothole on MG Road was reported by 15 citizens and verified instantly. The municipal corporation resolved it within 48 hours.
                      </p>
                      <div className="text-xs text-slate-400">Reported on Oct 12, 2023</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Together, we build trust.</h3>
              <p className="text-slate-600 mb-8 max-w-sm">
                Every verified issue and resolved report builds a stronger foundation for our community and local authorities.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
