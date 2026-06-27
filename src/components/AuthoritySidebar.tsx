"use client";

import Link from "next/link";
import { ShieldAlert, LayoutDashboard, ListTodo, BarChart3, Users, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export function AuthoritySidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/authority", icon: LayoutDashboard },
    { name: "Issue Management", href: "/authority/management", icon: ListTodo },
    { name: "Analytics", href: "/authority/analytics", icon: BarChart3 },
    { name: "Departments", href: "/authority/departments", icon: Users },
  ];

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col min-h-screen">
      <div className="h-20 flex items-center px-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center mr-3 shadow-md shadow-destructive/20">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">Authority Portal</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/authority");
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-destructive/10 text-destructive font-medium" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-destructive" : "text-muted-foreground"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer font-medium mb-2">
          <Settings className="w-5 h-5" />
          Settings
        </div>
        <div className="mt-2 p-3 rounded-2xl bg-accent/50 flex items-center gap-3 border border-border/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold shadow-inner">
            MC
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">City Council</span>
            <span className="text-xs text-muted-foreground font-medium">Role: Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
