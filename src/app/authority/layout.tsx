import { AuthoritySidebar } from "@/components/AuthoritySidebar";

export default function AuthorityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <AuthoritySidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar Placeholder */}
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-8 justify-between z-10 sticky top-0">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Authority Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64 h-10 bg-accent/50 rounded-full border border-border flex items-center px-4 text-muted-foreground text-sm">
              Search... (Ctrl+K)
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
