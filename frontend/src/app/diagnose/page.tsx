"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, 
  Camera, 
  FileText, 
  ChevronRight, 
  Zap, 
  RefreshCcw, 
  ShieldCheck, 
  Droplets, 
  Info, 
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DiagnosePage() {
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [task, setTask] = useState<"easy" | "medium" | "hard">("easy");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const crops = ["All", "Tomato", "Potato", "Pepper"];
  const tasks = [
    { id: "easy", label: "Task 1 (Easy)", color: "emerald", desc: "Disease Name Only" },
    { id: "medium", label: "Task 2 (Medium)", color: "amber", desc: "Brief Advisory" },
    { id: "hard", label: "Task 3 (Hard)", color: "rose", desc: "Full Treatment Plan" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (file: File) => {
    setError(null);
    setPrediction(null);
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task", task);
    formData.append("crop", selectedCrop);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Prediction failed');
      setPrediction(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Ensure backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setFile(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[40vh] z-0 overflow-hidden">
        <Image src="/images/hero.jpg" alt="Field background" fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-[#f8fafc]"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-48 pb-20 flex flex-col items-center">
        {/* Navigation & Task Controls */}
        <div className="w-full flex flex-col lg:flex-row gap-8 mb-12 items-center justify-between">
          <div className="flex flex-col items-center lg:items-start w-full">
            <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              01. Select Crop Context
            </span>
            <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl shadow-xl shadow-emerald-900/5 border border-neutral-100">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${
                    selectedCrop === crop ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:text-emerald-600"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end w-full">
            <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" />
              02. Intelligence Level
            </span>
            <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-xl shadow-emerald-900/5 border border-neutral-100">
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTask(t.id as any)}
                  className={`group relative px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${
                    task === t.id 
                    ? `bg-${t.color}-500 text-white shadow-lg shadow-${t.color}-500/20` 
                    : "text-neutral-400 hover:text-neutral-900 shadow-none border border-transparent"
                  }`}
                >
                  {t.id.toUpperCase()}
                  <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-[9px] px-3 py-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none`}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
              >
                {!selectedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative cursor-pointer border-3 border-dashed border-neutral-100 hover:border-emerald-500/50 rounded-[2.5rem] py-32 flex flex-col items-center justify-center transition-all bg-neutral-50/50 hover:bg-emerald-50/10 group overflow-hidden"
                  >
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-50/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 p-8 bg-emerald-100/50 rounded-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Plus className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-black text-neutral-800 mb-2 relative z-10">Neural Leaf Scanner</h3>
                    <p className="text-neutral-500 font-bold text-xs tracking-widest uppercase mb-8 relative z-10 opacity-60">Awaiting visual sample input</p>
                    
                    <button 
                      className="relative z-10 flex items-center space-x-3 bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-[0.15em] shadow-[0_20px_40px_-5px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all active:scale-95 group/btn"
                    >
                      <Camera className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                      <span>Browse Files</span>
                    </button>
                    
                    <div className="mt-8 text-neutral-400 font-bold text-[10px] tracking-widest uppercase relative z-10 animate-pulse">
                      OR DROP IMAGE HERE
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="relative w-full lg:w-1/2 max-w-md">
                      <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-3xl"></div>
                      <img src={selectedImage} className="relative rounded-[2.5rem] w-full aspect-square object-cover border-8 border-white shadow-2xl z-10" />
                      <button onClick={reset} className="absolute -top-4 -right-4 p-3 bg-white text-rose-500 rounded-2xl shadow-xl z-20 hover:scale-110 transition-all border border-neutral-100">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                      <div className="flex items-center space-x-2 text-emerald-600 font-black mb-4 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="uppercase tracking-widest text-[10px]">Sample Verified</span>
                      </div>
                      <h2 className="text-4xl font-black text-neutral-900 mb-4 leading-tight">Ready for {task.toUpperCase()} Analysis</h2>
                      <p className="text-neutral-500 mb-10 font-medium">Our diagnostic engine will process this {selectedCrop} sample using the {task} advisory logic.</p>
                      
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="group relative w-full px-12 py-5 bg-neutral-900 hover:bg-emerald-600 disabled:bg-neutral-200 text-white font-black text-lg rounded-3xl transition-all shadow-2xl flex items-center justify-center overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          {isAnalyzing ? <><RefreshCcw className="w-6 h-6 mr-3 animate-spin" />Processing...</> : <><Zap className="w-5 h-5 mr-3 fill-white" />Compute Diagnosis</>}
                        </span>
                      </button>
                      
                      {error && (
                        <div className="mt-6 flex items-center space-x-3 text-rose-500 text-sm font-bold bg-rose-50 px-6 py-4 rounded-2xl border border-rose-100 w-full animate-shake">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* RESULTS UI */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-8"
              >
                {/* Minimal Header Result */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <img src={selectedImage!} className="w-24 h-24 rounded-2xl object-cover border-4 border-neutral-50" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-1 block">Identification</span>
                      <h3 className="text-4xl font-black text-neutral-900">{prediction.disease}</h3>
                      {task === "hard" && (
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.confidence * 100}%` }} className="h-full bg-emerald-500" />
                           </div>
                           <span className="text-[10px] font-black text-emerald-600">{Math.round(prediction.confidence * 100)}% Confidence</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={reset} className="px-8 py-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold rounded-2xl text-xs flex items-center gap-3 transition-colors border border-neutral-100">
                    <RefreshCcw className="w-4 h-4" /> New Analysis
                  </button>
                </div>

                {/* ADVISORY CONTENT */}
                <AnimatePresence>
                  {task !== "easy" && prediction.advisory && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`grid grid-cols-1 ${task === "hard" ? "lg:grid-cols-12" : ""} gap-8`}
                    >
                      <div className={`${task === "hard" ? "lg:col-span-12" : ""} bg-white rounded-[3rem] p-12 border border-neutral-100 shadow-2xl relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-8">
                          <Zap className={`w-12 h-12 text-${tasks.find(t=>t.id===task)?.color}-500/10 fill-current`} />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center space-x-3 mb-8">
                            <div className={`p-4 bg-emerald-50 rounded-2xl`}>
                               <FileText className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="text-2xl font-black text-neutral-900">AI Agricultural Insights</h4>
                          </div>
                          
                          <div className="prose prose-emerald max-w-none">
                            <div className="text-neutral-700 font-medium leading-relaxed text-lg">
                               <ReactMarkdown 
                                 remarkPlugins={[remarkGfm]}
                                 components={{
                                   h1: ({node, ...props}) => <h1 className="text-neutral-950 font-black text-3xl mb-6 mt-8" {...props} />,
                                   h2: ({node, ...props}) => <h2 className="text-neutral-950 font-black text-2xl mb-4 mt-6" {...props} />,
                                   h3: ({node, ...props}) => <h3 className="text-neutral-950 font-black text-xl mb-3 mt-5" {...props} />,
                                   h4: ({node, ...props}) => <h4 className="text-neutral-950 font-black text-lg mb-2 mt-4 underline decoration-emerald-500/30 underline-offset-4" {...props} />,
                                   strong: ({node, ...props}) => <strong className="text-emerald-700 font-black" {...props} />,
                                   p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                   ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2" {...props} />,
                                   li: ({node, ...props}) => <li className="pl-2" {...props} />
                                 }}
                               >
                                 {prediction.advisory}
                               </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>

                      {task === "hard" && (
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-neutral-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-600/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                            <h4 className="text-2xl font-black mb-8 flex items-center gap-3">
                              <Droplets className="w-6 h-6 text-emerald-400" /> Action Checklist
                            </h4>
                            <div className="space-y-4 text-neutral-400 font-bold text-sm">
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                 <Plus className="w-4 h-4 text-emerald-400" /> Identify affected rows
                              </div>
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                 <Plus className="w-4 h-4 text-emerald-400" /> Apply recommended treatment
                              </div>
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                 <Plus className="w-4 h-4 text-emerald-400" /> Schedule 7-day follow-up
                              </div>
                            </div>
                          </div>
                          <div className="bg-emerald-500 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-center border-4 border-white/20">
                             <Info className="w-10 h-10 mb-6" />
                             <h4 className="text-3xl font-black mb-4 tracking-tight">Expert Consult</h4>
                             <p className="font-bold text-emerald-50 leading-relaxed mb-8">This diagnosis is provided by our Neural Command engine. For high-value crops, verify with a physical sample.</p>
                             <button className="bg-white text-emerald-600 font-black px-10 py-5 rounded-3xl text-sm shadow-xl hover:-translate-y-1 transition-transform">
                               Download Bio-Report (PDF)
                             </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0; opacity: 0; }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </main>
  );
}
