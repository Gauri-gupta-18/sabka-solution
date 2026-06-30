"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Phone, ShieldAlert, HeartPulse, Flame, Car, ShieldCheck, Users, Info, CheckCircle2 } from "lucide-react";
import { TiltCard } from "@/components/react-bits/TiltCard";

export default function HelpCenter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "support_messages"), {
        email,
        message,
        createdAt: new Date(),
        status: "new"
      });
      setIsSuccess(true);
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const helplines = [
    { name: "National Emergency", number: "112", icon: <ShieldAlert className="h-6 w-6" />, color: "bg-red-100 text-red-600" },
    { name: "Police", number: "100", icon: <ShieldCheck className="h-6 w-6" />, color: "bg-primary/20 text-primary" },
    { name: "Fire Brigade", number: "101", icon: <Flame className="h-6 w-6" />, color: "bg-orange-100 text-orange-600" },
    { name: "Ambulance", number: "102", icon: <HeartPulse className="h-6 w-6" />, color: "bg-emerald-100 text-emerald-600" },
    { name: "Women Helpline", number: "1091", icon: <Users className="h-6 w-6" />, color: "bg-pink-100 text-pink-600" },
    { name: "Child Helpline", number: "1098", icon: <HeartPulse className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
    { name: "Road Accident", number: "1073", icon: <Car className="h-6 w-6" />, color: "bg-amber-100 text-amber-600" },
    { name: "Cyber Crime", number: "1930", icon: <Info className="h-6 w-6" />, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Help Center</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find answers to your questions, learn how to use the platform, and access important government and emergency helplines.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 flex items-center gap-3">
              <Phone className="h-8 w-8 text-primary" />
              Emergency & Government Helplines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {helplines.map((helpline, idx) => (
                <TiltCard key={idx}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-border h-full flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${helpline.color}`}>
                      {helpline.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{helpline.name}</h3>
                    <a href={`tel:${helpline.number}`} className="text-2xl font-bold text-primary hover:underline">
                      {helpline.number}
                    </a>
                  </div>
                </TiltCard>
              ))}
            </div>
            <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
              <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">When to use these numbers?</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  The helplines listed above are for immediate emergencies or specific government assistance. For general community issues like potholes, broken streetlights, or waste management, please use the Sabka Solution reporting tool on your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">How do I report an issue?</h4>
                  <p className="text-slate-600 text-sm">Log in to your account, go to the Dashboard, and click on "Report an Issue". You can upload photos and provide a description.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">How does verification work?</h4>
                  <p className="text-slate-600 text-sm">Other community members near the reported location can verify the issue. Once verified, it gets prioritized for authorities.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Are my details public?</h4>
                  <p className="text-slate-600 text-sm">No, we value your privacy. Your personal information is kept secure and is not publicly displayed on reports.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Contact Support</h2>
              <p className="text-slate-600 mb-6">Need help with your account or experiencing technical issues? Our support team is here to help.</p>
              
              {isSuccess ? (
                <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="text-success text-sm">We've received your message and will get back to you shortly.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-sm font-medium text-success hover:text-success/80 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]" 
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
