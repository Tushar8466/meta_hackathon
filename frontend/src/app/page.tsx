import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MainDashboard from "@/components/MainDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <Hero />
      
      {/* Footer */}
      <footer className="py-20 border-t border-neutral-100 mt-20 text-center relative z-10">
        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
          © 2026 CropAI Diagnostic Systems • Built for Hackathon
        </p>
      </footer>
    </main>
  );
}
