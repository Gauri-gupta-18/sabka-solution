"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Camera, Brain, Users, Building, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "1. Report an Issue",
      description: "Snap a photo of the problem (pothole, garbage, broken streetlight) and add a brief description along with the location."
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: "2. AI Analysis",
      description: "Our AI engine automatically detects the category, severity, and checks for duplicates, ensuring efficient routing."
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: "3. Community Verification",
      description: "Local citizens confirm the issue to build trust. Highly verified issues get prioritized automatically."
    },
    {
      icon: <Building className="h-8 w-8 text-amber-500" />,
      title: "4. Authority Action",
      description: "The assigned department receives the verified report and begins working on a resolution."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
      title: "5. Resolution & Impact",
      description: "Once resolved, you receive a notification, and you earn Trust Points for contributing to your city."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-lg text-slate-600">A transparent, step-by-step process from reporting to resolution.</p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:border-none space-y-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-slate-200 -z-10" />
                
                <div className={`md:w-1/2 flex ${idx % 2 === 0 ? 'md:justify-end text-left md:text-right' : 'md:order-2 text-left'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                <div className={`absolute -left-[17px] md:relative md:left-0 w-8 h-8 md:w-16 md:h-16 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center shadow-md ${idx % 2 === 0 ? '' : 'md:order-1'}`}>
                  <div className="hidden md:block">{step.icon}</div>
                  <div className="md:hidden w-3 h-3 rounded-full bg-primary" />
                </div>
                
                <div className={`hidden md:block md:w-1/2 ${idx % 2 === 0 ? 'md:order-3' : 'md:order-0'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
