"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Map as MapIcon, Shield, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlurText } from "@/components/react-bits/BlurText";
import { FadeUp } from "@/components/react-bits/FadeUp";
import { Magnetic } from "@/components/react-bits/Magnetic";
import { TiltCard } from "@/components/react-bits/TiltCard";
import { AnimatedNumber } from "@/components/ui/animated-number";
import dynamic from "next/dynamic";

const HeroMap = dynamic(() => import("@/components/map/HeroMap"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);
  const orbRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(badgeRef.current, { opacity: 0, y: 30, scale: 0.9, duration: 0.6 })
        .from(headingRef.current, { opacity: 0, y: 50, duration: 0.8 }, "-=0.3")
        .from(subRef.current, { opacity: 0, y: 30, duration: 0.6 }, "-=0.4")
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");

      // Floating orbs
      gsap.to(orbRef1.current, {
        y: -30, x: 15,
        duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(orbRef2.current, {
        y: 25, x: -20,
        duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(orbRef3.current, {
        y: -20, x: 10, scale: 1.1,
        duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut"
      });

      // Features section scroll animation
      const featureCards = featuresRef.current?.querySelectorAll(".feature-card");
      if (featureCards && featureCards.length > 0) {
        gsap.fromTo(featureCards, 
          { opacity: 0, y: 60, rotationX: 10 },
          {
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      }

      // Stats counter animation is now handled by the AnimatedNumber React component

      // Stats section slide in
      gsap.from(statsRef.current, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
      });

      // Map mockup parallax
      const mapMockup = document.querySelector(".map-mockup");
      if (mapMockup) {
        gsap.from(mapMockup, {
          scrollTrigger: {
            trigger: mapMockup,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: 80,
          rotationY: 8,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Final CTA
      gsap.from(finalCtaRef.current, {
        scrollTrigger: {
          trigger: finalCtaRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        ease: "power2.out",
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main ref={heroRef} className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E8F7EE] via-[#F6FFF9] to-white -z-10" />

          {/* Animated floating orbs — mint/emerald/teal */}
          <div ref={orbRef1} className="absolute top-20 left-[8%] w-32 h-32 bg-gradient-to-br from-primary/15 to-emerald-200/20 rounded-full blur-2xl" />
          <div ref={orbRef2} className="absolute bottom-20 right-[8%] w-40 h-40 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-full blur-3xl" />
          <div ref={orbRef3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#E8F7EE]/40 to-emerald-50/30 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div ref={badgeRef} className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-emerald-50 border border-primary/20 text-primary text-sm font-semibold shadow-sm">
                <Sparkles className="h-4 w-4" />
                Empowering Smart Communities
              </div>

              <h1 ref={headingRef} className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
                Your Voice. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00C853] to-secondary">
                  Our Community.
                </span>{" "}
                One Solution.
              </h1>

              <p ref={subRef} className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Report civic issues, track real-time resolutions, and build a better city together. Powered by AI and verified by citizens.
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
                <Link href="/dashboard/report">
                  <Magnetic intensity={0.2}>
                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 transition-all duration-300">
                      Report an Issue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Magnetic>
                </Link>
                <Link href="/impact">
                  <Magnetic intensity={0.2}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-border hover:bg-accent hover:border-primary/30 transition-all duration-300">
                      Explore Community
                    </Button>
                  </Magnetic>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex justify-center">
                <BlurText text="How Sabka Solution Works" delay={0.05} />
              </h2>
              <p className="text-lg text-muted-foreground">A transparent, AI-driven process from reporting to resolution.</p>
            </div>

            <div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: "1. AI Analysis",
                  description: "Snap a photo and describe the issue. Our AI instantly categorizes and prioritizes your report.",
                  gradient: "from-[#E8F7EE] to-emerald-50",
                  border: "hover:border-primary/30",
                },
                {
                  icon: <Users className="h-6 w-6 text-primary" />,
                  title: "2. Community Verification",
                  description: "Citizens verify issues to build trust, ensuring authorities focus on real problems.",
                  gradient: "from-[#F0FFF7] to-teal-50",
                  border: "hover:border-secondary/30",
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                  title: "3. Swift Resolution",
                  description: "Authorities receive organized reports, update status in real-time, and resolve issues faster.",
                  gradient: "from-emerald-50 to-[#E8F7EE]",
                  border: "hover:border-[#00C853]/30",
                }
              ].map((feature, idx) => (
                <TiltCard key={idx}>
                  <div
                    className={`feature-card bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border border-border/60 ${feature.border} hover:shadow-xl transition-all duration-300 cursor-default group h-full`}
                  >
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Live Statistics / Map Preview CTA */}
        <section className="py-24 bg-[#0A2E1B] text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-[#0A2E1B] to-[#0A2E1B]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div ref={statsRef} className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  <FadeUp duration={0.8} delay={0.2}>
                    Visualizing our <br />
                    <span className="text-primary">City&apos;s Progress</span>
                  </FadeUp>
                </h2>
                <p className="text-lg text-white/70 mb-8 max-w-lg">
                  Explore the live interactive map to see active issues, recently resolved problems, and community hotspots in your neighborhood.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div>
                    <div className="text-4xl font-extrabold text-white mb-2">
                      <AnimatedNumber value={14200} suffix="k+" />
                    </div>
                    <div className="text-white/50 font-medium">Issues Resolved</div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-primary mb-2">
                      <AnimatedNumber value={98} suffix="%" />
                    </div>
                    <div className="text-white/50 font-medium">Verification Rate</div>
                  </div>
                </div>

                <Link href="/dashboard/map">
                  <Magnetic intensity={0.15}>
                    <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all duration-300">
                      <MapIcon className="mr-2 h-5 w-5" />
                      Open Live Map
                    </Button>
                  </Magnetic>
                </Link>
              </div>

              {/* Map Preview Mockup */}
              <div className="map-mockup relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-[#0D3D23] isolate">
                  <HeroMap />
                  
                  {/* Glass Card Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 bg-[#0A2E1B]/60 backdrop-blur-md border border-white/20 p-4 rounded-xl z-[400] pointer-events-none">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Pothole Repaired</div>
                        <div className="text-sm text-white/60">Residency Road • Just now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-white text-center">
          <div className="container mx-auto px-4">
            <div ref={finalCtaRef} className="max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 flex justify-center">
                <BlurText text="Ready to make a difference?" delay={0.05} />
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of citizens and local authorities working together to create cleaner, safer, and smarter cities.
              </p>
              <Link href="/signup">
                <Magnetic intensity={0.2}>
                  <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/25 hover:shadow-2xl transition-all duration-300">
                    Create Your Account
                  </Button>
                </Magnetic>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
