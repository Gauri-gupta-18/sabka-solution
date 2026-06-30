"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, Users, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AuroraBackground } from "@/components/react-bits/AuroraBackground";
import { BlurText } from "@/components/react-bits/BlurText";
import { Magnetic } from "@/components/react-bits/Magnetic";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Auth Profile
      await updateProfile(user, { displayName: name });
      
      // Create Firestore User Document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: name,
        role: "Citizen",
        trustScore: 0,
        citizenRank: "New Member",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      router.push("/dashboard");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Set user document for Google signup (if it doesn't exist, we just overwrite/create it)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "Citizen",
        trustScore: 0,
        citizenRank: "New Member",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
      
      router.push("/dashboard");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="p-4" showRadialGradient={true}>
      <div className="container mx-auto min-h-screen flex items-center justify-center py-12 relative z-10 text-white">
        <div className="w-full max-w-6xl flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Benefits & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center mt-8 lg:mt-0"
          >
            <Link href="/" className="hidden lg:inline-block mb-10">
              <Image src="/logo.jpg" alt="Sabka Solution Logo" width={220} height={80} className="object-contain h-16 w-auto mix-blend-screen rounded-lg shadow-sm" />
            </Link>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white leading-tight text-center lg:text-left drop-shadow-md">
              Join the movement for<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(46,207,143,0.5)]">better cities.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Create an account to start reporting issues, verifying community reports, and earning rewards for your civic participation.
            </p>

            <div className="space-y-6 max-w-md mx-auto lg:mx-0">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-xl border border-primary/30">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Instant Reporting</h3>
                  <p className="text-sm text-slate-300">AI-powered categorization ensures your report reaches the right authorities immediately.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/20 p-3 rounded-xl border border-secondary/30">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Verified Impact</h3>
                  <p className="text-sm text-slate-300">Track the real-time status of your reports and see exactly how they are being resolved.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-success/20 p-3 rounded-xl border border-success/30">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Community Trust</h3>
                  <p className="text-sm text-slate-300">Build your trust score by verifying other issues and become a recognized active citizen.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Signup Form */}
          <div className="flex flex-col justify-center items-center w-full">
            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden mb-8"
            >
              <Link href="/">
                <Image src="/logo.jpg" alt="Sabka Solution Logo" width={220} height={80} className="object-contain h-16 w-auto mix-blend-screen rounded-lg shadow-sm" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-2xl border-white/10 bg-zinc-950/60 backdrop-blur-xl text-white">
                <CardHeader className="space-y-2 text-center pb-6">
                  <CardTitle className="text-2xl font-bold flex justify-center text-white">
                    <BlurText text="Create an account" delay={0.05} />
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Join the community and start making a difference
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 transition-shadow focus:shadow-[0_0_10px_rgba(46,207,143,0.2)] focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 transition-shadow focus:shadow-[0_0_10px_rgba(46,207,143,0.2)] focus:border-primary/50"
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-200">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 transition-shadow focus:shadow-[0_0_10px_rgba(46,207,143,0.2)] focus:border-primary/50"
                        autoComplete="new-password"
                      />
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive font-medium bg-destructive/5 px-3 py-2 rounded-md border border-destructive/20"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    
                    <Magnetic intensity={0.1}>
                      <Button type="submit" className="w-full h-11 text-base font-medium transition-transform active:scale-[0.98]" disabled={loading}>
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                        ) : "Sign up"}
                      </Button>
                    </Magnetic>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-950 px-2 text-slate-400 rounded-full">Or continue with</span>
                    </div>
                  </div>

                  <Magnetic intensity={0.1}>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full h-11 bg-white/5 hover:bg-white/10 text-white font-medium border-white/10 transition-transform active:scale-[0.98]" 
                      onClick={handleGoogleSignup}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" aria-hidden="true">
                        <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                        <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                        <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                        <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                      </svg>
                      Continue with Google
                    </Button>
                  </Magnetic>
                </CardContent>
                <CardFooter className="flex flex-col border-t border-white/10 p-6 bg-white/5 rounded-b-xl">
                  <p className="text-center text-sm text-slate-300 w-full">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                      Log in
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
