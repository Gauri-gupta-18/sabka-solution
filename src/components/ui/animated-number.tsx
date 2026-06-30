"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, isInView]);

  // Formatter function to match the original stat string formatting
  const formatted = 
    value >= 1000 ? (count / 1000).toFixed(1).replace(/\.0$/, "") : 
    (suffix === "m" && value === 24) ? (count / 10).toFixed(1) : count;

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
