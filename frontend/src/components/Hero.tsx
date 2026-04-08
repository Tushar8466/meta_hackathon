"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Bolt, Zap, BarChart2, MoreVertical } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background Image: Full Cover, Max Clarity */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/hero.jpg"
          alt="Lush Crop Field"
          fill
          className="object-cover transition-all duration-700"
          priority
        />
        {/* Minimalist transparent overlay for text contrast */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center relative z-10 px-8 py-20 mt-12">
        <motion.div
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, ease: "circOut" }}
           className="flex flex-col items-center mb-8"
        >
          <h1 className="flex flex-col text-6xl md:text-9xl font-black leading-[0.85] tracking-[-0.04em] text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
             <span>HARVESTING</span>
             <span className="block">INTELLIGENCE</span>
             <span className="text-emerald-500 block">FOR EVERY FARMER</span>
          </h1>
        </motion.div>

        {/* Informative Subheading - Proportionally balanced */}
        <motion.p
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3, duration: 1 }}
           className="text-lg md:text-2xl text-neutral-200 max-w-3xl mx-auto leading-relaxed mb-14 font-medium tracking-tight drop-shadow-lg"
        >
          Helping smallholder farmers overcome every challenge through elite diagnostics, precision recommendations, and automated 12-month action plans.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
           className="flex flex-wrap justify-center items-center gap-6"
        >
          <Link href="/diagnose" className="flex items-center space-x-3 text-black font-black tracking-widest uppercase bg-emerald-500 px-12 py-5 rounded-full border border-emerald-400/50 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-[1.03] active:scale-95 transition-all duration-300 group">
            <span className="text-sm">LAUNCH_DIAGNOSIS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          
          <button className="flex items-center space-x-3 text-white font-black tracking-widest uppercase bg-neutral-900/40 backdrop-blur-md border border-white/10 px-12 py-5 rounded-full hover:bg-neutral-800/60 hover:border-white/20 transition-all duration-300 active:scale-95 group">
            <span className="text-sm">ACCESS_ARCHIVE</span>
            <Clock className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Floating Side Elements */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-4">
        <motion.div 
           initial={{ x: 50, opacity: 0 }} 
           animate={{ x: 0, opacity: 1 }} 
           transition={{ delay: 0.5 }}
           className="relative flex items-center justify-end group cursor-pointer"
        >
          <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <span className="bg-black/80 text-white text-[10px] font-black tracking-widest px-4 py-2 border border-white/10 uppercase italic whitespace-nowrap">TOGGLE NEURAL MODE</span>
          </div>
          <div className="p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl hover:bg-emerald-500/20 group transition-all">
            <Bolt className="w-5 h-5 text-white/60 group-hover:text-emerald-400 group-hover:animate-pulse" />
          </div>
        </motion.div>

        <div className="flex flex-col space-y-2">
           {[Zap, BarChart2, MoreVertical].map((Icon, idx) => (
             <div key={idx} className="p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl hover:bg-emerald-500/20 group transition-all cursor-pointer">
               <Icon className="w-5 h-5 text-white/40 group-hover:text-emerald-400" />
             </div>
           ))}
        </div>
      </div>

      {/* Optional decorative indicator for scrolling */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 0.3 }}
         transition={{ delay: 1.5, duration: 2 }}
         className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-linear-to-b from-emerald-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}
