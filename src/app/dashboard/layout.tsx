"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  ShieldCheck, 
  Bell, 
  Award,
  LogOut,
  MapPin,
  Menu,
  X,
  Settings,
  BarChart3,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
    { href: "/dashboard/reports", label: "Reports", icon: <FileText size={20} /> },
    { href: "/dashboard/team", label: "My Team", icon: <Users size={20} /> },
  ];

  const links = (user.role === 'Authority' || user.role === 'Admin' || user.role === 'Super Admin') 
    ? authorityLinks 
    : citizenLinks;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border fixed h-full z-10">
        <div className="p-4 border-b border-border h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <MapPin size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Sabka<span className="text-primary">Solution</span>
            </span>
          </Link>
        </div>

        <div className="p-4 border-b border-border flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.photoURL || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold truncate">{user.displayName || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{user.role}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-lg">
              <MapPin size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Sabka<span className="text-primary">Solution</span>
            </span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-20 flex flex-col border-t border-border">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-bold">{user.displayName || "User"}</div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <span className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}>
                      {link.icon}
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border pb-safe">
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
