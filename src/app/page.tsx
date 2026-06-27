"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CheckCircle2, Map as MapIcon, Shield, Users } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />
          
          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-[10%] w-24 h-24 bg-primary/5 rounded-full blur-2xl" 
          />
          <motion.div 
            animate={{ y: [0, 30, 0] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-24 right-[10%] w-32 h-32 bg-secondary/5 rounded-full blur-3xl" 
          />

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="max-w-4xl mx-auto flex flex-col items-center"
            >
              <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                Empowering Smart Communities
              </motion.div>
              
              <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Your Voice. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Our Community.
                </span>{" "}
                One Solution.
              </motion.h1>
              
              <motion.p variants={item} className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Report civic issues, track real-time resolutions, and build a better city together. Powered by AI and verified by citizens.
              </motion.p>
              
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/report">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                    Report an Issue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/impact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-slate-200 hover:bg-slate-50 transition-all">
                    Explore Community
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Sabka Solution Works</h2>
              <p className="text-lg text-slate-600">A transparent, AI-driven process from reporting to resolution.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: "1. AI Analysis",
                  description: "Snap a photo and describe the issue. Our AI instantly categorizes and prioritizes your report."
                },
                {
                  icon: <Users className="h-6 w-6 text-primary" />,
                  title: "2. Community Verification",
                  description: "Citizens verify issues to build trust, ensuring authorities focus on real problems."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                  title: "3. Swift Resolution",
                  description: "Authorities receive organized reports, update status in real-time, and resolve issues faster."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Statistics / Map Preview CTA */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Visualizing our <br />
                  <span className="text-primary">City's Progress</span>
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-lg">
                  Explore the live interactive map to see active issues, recently resolved problems, and community hotspots in your neighborhood.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div>
                    <div className="text-4xl font-extrabold text-white mb-2">14.2k+</div>
                    <div className="text-slate-400 font-medium">Issues Resolved</div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-primary mb-2">98%</div>
                    <div className="text-slate-400 font-medium">Verification Rate</div>
                  </div>
                </div>

                <Link href="/map">
                  <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white">
                    <MapIcon className="mr-2 h-5 w-5" />
                    Open Live Map
                  </Button>
                </Link>
              </div>

              {/* Map Preview Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-slate-800">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/12.9716,77.5946,12,0/800x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA')] bg-cover bg-center opacity-50" />
                  
                  {/* Mock Markers */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" />
                  <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" />
                  
                  {/* Glass Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Pothole Repaired</div>
                        <div className="text-sm text-slate-300">Residency Road • Just now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white text-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to make a difference?</h2>
              <p className="text-xl text-slate-600 mb-10">
                Join thousands of citizens and local authorities working together to create cleaner, safer, and smarter cities.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Create Your Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
