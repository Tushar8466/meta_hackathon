"use client";

import React from "react";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-card shadow-sm mx-auto mt-4 rounded-2xl max-w-5xl"
    >
      <Link href="/" className="flex items-center space-x-2 group">
        <div className="p-2 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
          <Leaf className="w-6 h-6 text-emerald-600" />
        </div>
        <span className="text-xl font-bold tracking-tight text-neutral-800">
          Crop<span className="text-emerald-600 font-extrabold">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-emerald-600 transition-colors">Home</Link>
        <Link href="/diagnose" className="text-sm font-bold text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all">Diagnose</Link>
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
          Try Now
        </button>
      </div>

      {/* Mobile Menu Icon (Simplified for demo) */}
      <div className="md:hidden p-2 bg-neutral-100 rounded-lg">
        <Leaf className="w-5 h-5 text-emerald-600" />
      </div>
    </motion.nav>
  );
}
