"use client";

import Link from "next/link";
import { Globe, MessageSquare, Mail, Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#F0FFF7] border-t border-border/60 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Animated gradient separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.jpg" alt="Sabka Solution Logo" width={200} height={80} className="object-contain h-14 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your voice. Our community. One solution. Empowering citizens and authorities to build better cities together through AI and community collaboration.
            </p>
            <div className="flex gap-3">
              <button className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Website">
                <Globe size={18} />
              </button>
              <button className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Messages">
                <MessageSquare size={18} />
              </button>
              <button className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Email">
                <Mail size={18} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/impact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Impact</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/transparency" className="text-sm text-muted-foreground hover:text-primary transition-colors">Transparency Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/help-center" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sabka Solution. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart size={14} className="text-primary fill-primary" />
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
