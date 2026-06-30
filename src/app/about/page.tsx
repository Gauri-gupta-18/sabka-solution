"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              About <span className="text-primary">Sabka Solution</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300"
            >
              We believe in the power of community. Our platform bridges the gap between citizens and authorities to create smarter, cleaner, and safer cities.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To empower every citizen with a voice and provide authorities with actionable, AI-driven data to resolve civic issues efficiently.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                  <Users size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Community First</h3>
                <p className="text-slate-600 leading-relaxed">
                  Through crowd-sourced verification and transparent reporting, we build trust and foster collaboration in local neighborhoods.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <Heart size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                  A future where urban problems are identified instantly and resolved seamlessly, making cities better places to live for everyone.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="py-16 bg-slate-50 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border inline-block text-left">
                <p className="text-lg text-slate-700 font-medium mb-2">Founder & Lead Developer</p>
                <h3 className="text-2xl font-bold text-primary mb-4">Gauri Gupta</h3>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="font-semibold text-slate-800">Email:</span>
                  <a href="mailto:gaurigupta.works@gmail.com" className="hover:text-primary transition-colors">
                    gaurigupta.works@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
