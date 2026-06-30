"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, setDoc, collection, getCountFromServer } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { AuroraBackground } from "@/components/react-bits/AuroraBackground";
import { BlurText } from "@/components/react-bits/BlurText";
import { Magnetic } from "@/components/react-bits/Magnetic";
import { AnimatedNumber } from "@/components/ui/animated-number";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const error = err as { code?: string; message?: string };
      const code = error.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later or reset your password.");
      } else {
        setError(error.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Ensure Firestore user doc exists for first-time Google sign-ins
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          role: "Citizen",
          trustScore: 0,
          citizenRank: "New Member",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      router.push("/dashboard");
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/popup-closed-by-user") {
        // User dismissed – no error needed
      } else {
        setError(error.message || "Failed to login with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address above, then click Forgot password.");
      return;
    }
    setResetLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError(error.message || "Failed to send reset email.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuroraBackground className="p-4" showRadialGradient={true}>
      <div className="container mx-auto min-h-screen flex items-center justify-center py-12 relative z-10 text-white">
        <div className="w-full max-w-6xl flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Stats & Info */}
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
              Community action,<br/><span className="text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">real-time impact.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Sabka Solution empowers you to report, verify, and resolve civic issues faster. Join our growing network of active citizens today.
            </p>

            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white/10 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all">
                <div className="text-2xl lg:text-3xl font-extrabold text-primary mb-1 drop-shadow-sm"><AnimatedNumber value={14200} suffix="k+" /></div>
                <div className="text-xs lg:text-sm font-medium text-slate-200">Issues Resolved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all">
                <div className="text-2xl lg:text-3xl font-extrabold text-secondary mb-1 drop-shadow-sm"><AnimatedNumber value={98} suffix="%" /></div>
                <div className="text-xs lg:text-sm font-medium text-slate-200">Verification Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all">
                <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 mb-1 drop-shadow-sm"><AnimatedNumber value={24} suffix="m" /></div>
                <div className="text-xs lg:text-sm font-medium text-slate-200">Avg Response Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-4 lg:p-6 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all">
                <div className="text-2xl lg:text-3xl font-extrabold text-teal-400 mb-1 drop-shadow-sm"><AnimatedNumber value={45000} suffix="k+" /></div>
                <div className="text-xs lg:text-sm font-medium text-slate-200">Active Citizens</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Login Form */}
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
              <BlurText text="Welcome back" delay={0.05} />
            </CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to your SabkaSolution account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {resetSent ? (
                <motion.div
                  key="reset-sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-success" />
                  <h3 className="font-semibold text-slate-800">Reset email sent!</h3>
                  <p className="text-sm text-slate-500">
                    Check your inbox at <strong>{email}</strong> for a password reset link.
                  </p>
                  <Button variant="outline" onClick={() => setResetSent(false)} className="mt-2">
                    Back to Sign In
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 transition-shadow focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:border-primary/50"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-200">Password</Label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          disabled={resetLoading}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-60 flex items-center gap-1"
                        >
                          {resetLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 transition-shadow focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:border-primary/50"
                        autoComplete="current-password"
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
                      <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium transition-transform active:scale-[0.98]"
                        disabled={loading}
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                        ) : "Sign in"}
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
                      onClick={handleGoogleLogin}
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
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-white/10 p-6 bg-white/5 rounded-b-xl">
            <p className="text-center text-sm text-slate-300 w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Sign up for free
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
