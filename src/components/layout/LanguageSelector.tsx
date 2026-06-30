"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse the current language from the googtrans cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const googtransCookie = cookies.find(c => c.trim().startsWith('googtrans='));
    
    if (googtransCookie) {
      // e.g. "googtrans=/en/hi"
      const parts = googtransCookie.split('=')[1].split('/');
      if (parts.length > 2) {
        const lang = parts[2];
        if (languages.find(l => l.code === lang)) {
          setCurrentLang(lang);
        }
      }
    } else {
      // Check if browser default is supported and match it (optional)
      // We will stick to 'en' as default if no cookie exists.
      setCurrentLang('en');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    // Set the cookie for google translate (e.g., /en/hi translates from english to hindi)
    // To reset to english, we can just clear it or set to /en/en
    const transString = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
    
    // Set cookie on both domain and non-domain to ensure it sticks
    const domain = window.location.hostname;
    document.cookie = `googtrans=${transString}; path=/`;
    document.cookie = `googtrans=${transString}; path=/; domain=${domain}`;
    
    // Google Translate requires a page reload to read the cookie and apply the script cleanly
    window.location.reload();
  };

  const selectedLangInfo = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary active:scale-95 group border border-transparent hover:border-primary/20"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
        <span className="hidden sm:inline-block text-slate-700 group-hover:text-primary">{selectedLangInfo.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border border-border shadow-lg rounded-xl overflow-hidden py-2"
          >
            <div className="px-3 pb-2 mb-2 border-b border-border">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Language</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto px-1 scrollbar-thin">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors mb-1 ${
                    currentLang === lang.code 
                      ? "bg-primary/10 text-primary font-bold" 
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{lang.name}</span>
                  </div>
                  {currentLang === lang.code && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
