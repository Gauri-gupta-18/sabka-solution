"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  ShieldCheck, 
  Award,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // GSAP page transition on route change
  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const citizenLinks = [
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { href: "/dashboard/report", label: "Report Issue", icon: <FileText size={20} /> },
    { href: "/dashboard/my-reports", label: "My Reports", icon: <FileText size={20} /> },
    { href: "/dashboard/map", label: "Issue Map", icon: <Map size={20} /> },
    { href: "/dashboard/verify", label: "Verify Issues", icon: <ShieldCheck size={20} /> },
    { href: "/dashboard/rewards", label: "My Rewards", icon: <Award size={20} /> },
  ];

  const authorityLinks = [
    { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { href: "/dashboard/manage", label: "Manage Issues", icon: <Settings size={20} /> },
    { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { href: "/dashboard/map", label: "Issue Map", icon: <Map size={20} /> },
  ];

  const links = (user.role === 'Authority' || user.role === 'Admin' || user.role === 'Super Admin') 
    ? authorityLinks 
    : citizenLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-border/60 fixed h-full z-10">
        <div className="p-4 border-b border-border/60 h-16 flex items-center">
          <Link href="/" className="inline-block">
            <Image src="/logo.jpg" alt="Sabka Solution Logo" width={150} height={40} className="object-contain h-10 w-auto" />
          </Link>
        </div>

        <div className="p-4 border-b border-border/60 flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-secondary rounded-full opacity-60" />
            <Avatar className="relative">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold truncate">{user.displayName || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{user.role}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}>
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/60">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-border/60 h-16 flex items-center justify-between px-4 sticky top-0 z-20">
          <Link href="/" className="inline-block">
            <Image src="/logo.jpg" alt="Sabka Solution Logo" width={120} height={32} className="object-contain h-8 w-auto" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden fixed right-0 top-0 h-full w-[280px] bg-white z-30 flex flex-col border-l border-border/60 shadow-2xl"
              >
                <div className="p-4 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{user.displayName || "User"}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-accent transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <span className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}>
                          {link.icon}
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-3 border-t border-border/60 pb-safe">
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={handleLogout}>
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main ref={mainRef} className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
