"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  Info, 
  ChevronRight,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import axios from "axios";

// Mock data for the hackathon (actual API would replace this)
const TREATMENT_DB: Record<string, any> = {
  "Tomato_Late_blight": {
    treatment: "Apply fungicides like Chlorothalonil or Copper. Remove infected leaves immediately and improve air circulation.",
    prevention: ["Avoid overhead watering", "Ensure proper spacing", "Use blight-resistant varieties", "Rotate crops yearly"]
  },
  "Potato___Early_blight": {
    treatment: "Use appropriate fungicides such as Daconil or Mancozeb. Keep foliage dry and prune lower branches.",
    prevention: ["Mulch the soil", "Maintain healthy soil nutrients", "Water at the base of plants", "Clean all garden tools"]
  },
  "Pepper__bell___Bacterial_spot": {
    treatment: "Apply copper-based sprays. Avoid handling plants when wet. Copper sprays may help reduce spread.",
    prevention: ["Buy certified disease-free seeds", "Control weeds around perimeter", "Dispose of infected debris", "Balanced fertilizer"]
  }
};

export default function MainDashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>("All");

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    setPrediction(null);
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);

    // Prepare FormData for the actual API call
    const formData = new FormData();
    formData.append("file", file);
    if (cropType !== "All") formData.append("crop", cropType);

    try {
      // Simulation for the UI demo (Replace with actual axios call)
      // await axios.post("/api/predict", formData);
      await new Promise(resolve => setTimeout(resolve, 2500)); 

      // Simulated Response based on backend classes (mocking for now)
      const mockClass = TREATMENT_DB["Tomato_Late_blight"] ? "Tomato_Late_blight" : "Potato___Early_blight";
      setPrediction({
        label: mockClass.replace(/_/g, " "),
        confidence: 0.942 + Math.random() * 0.05,
        diseaseKey: mockClass
      });
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setFile(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      {/* Crop Selector Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-center items-center gap-4 flex-wrap"
      >
        <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Select Crop Context</span>
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-200/50 shadow-inner flex overflow-hidden">
          {["All", "Tomato", "Potato", "Pepper"].map((crop) => (
            <button
              key={crop}
              onClick={() => setCropType(crop)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                cropType === crop 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/20" 
                : "text-neutral-500 hover:bg-white hover:text-neutral-900"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Section */}
        <div className="lg:col-span-12">
          {!prediction ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-[0_10px_40px_-15px_rgba(34,197,94,0.1)] transition-all"
            >
              {!selectedImage ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative cursor-pointer border-3 border-dashed border-neutral-100 hover:border-emerald-200 rounded-[2rem] h-[400px] flex flex-col items-center justify-center transition-all bg-neutral-50/50 hover:bg-emerald-50/20 active:scale-[0.99] overflow-hidden"
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#22c55e05_0%,transparent_70%)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                  
                  <div className="w-20 h-20 bg-emerald-100/80 rounded-3xl flex items-center justify-center mb-6 shadow-inner animate-float">
                    <Upload className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-neutral-800 mb-2">Drop Your Leaf Scan</h3>
                  <p className="text-neutral-500 font-medium">Capture a clear photo of the infected area</p>
                  
                  <div className="mt-8 flex items-center space-x-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-2xl group-hover:bg-emerald-600 transition-colors shadow-xl shadow-neutral-900/10">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    <span>Browse Files</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                  <div className="relative group max-w-sm w-full">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2.5rem] blur-2xl opacity-0 truncate group-hover:opacity-100 transition-opacity"></div>
                    <img 
                      src={selectedImage} 
                      alt="Crop disease preview" 
                      className="relative rounded-[2rem] w-full aspect-square object-cover border-4 border-white shadow-2xl z-10"
                    />
                    <button 
                      onClick={reset}
                      className="absolute -top-3 -right-3 p-2 bg-rose-500 text-white rounded-full shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2">
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="uppercase tracking-widest text-xs">Image Verified</span>
                    </div>
                    <h2 className="text-3xl font-black text-neutral-900 mb-4 leading-tight">Ready for Diagnostic Diagnosis</h2>
                    <p className="text-neutral-500 mb-8 max-w-sm">Our AI is primed to analyze your crop sample. This scan covers 32+ common fungal and bacterial symptoms.</p>
                    
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="relative w-full md:w-auto px-10 py-5 bg-neutral-900 hover:bg-emerald-600 disabled:bg-neutral-300 text-white font-black text-lg rounded-3xl transition-all shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        {isAnalyzing ? (
                          <>
                            <RefreshCcw className="w-6 h-6 mr-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-3 fill-white" />
                            Analyze Image
                          </>
                        )}
                      </span>
                    </button>
                    {error && (
                      <div className="mt-4 flex items-center space-x-2 text-rose-500 text-sm font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Results Grid (appears when prediction exists) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Result Card */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] sticky top-28"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Diagnostic Report</span>
                    <h3 className="text-neutral-900 font-black text-xl">Analysis Feedback</h3>
                  </div>
                  <button onClick={reset} className="p-2 border border-neutral-100 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-neutral-100 mb-8 relative">
                   <img 
                    src={selectedImage!} 
                    alt="Analyzed crop" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] uppercase font-black flex items-center space-x-1 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    <span>Processed</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-3xl font-black text-rose-500 mb-1">{prediction.label}</h4>
                    <p className="text-sm font-bold text-neutral-400">Crop Health Index: Abnormal Detected</p>
                  </div>

                  <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center justify-between mb-3 font-black text-emerald-900">
                      <span className="text-sm">Confidence Score</span>
                      <span className="text-lg">{Math.round(prediction.confidence * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-emerald-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-emerald-600"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Treatment Sections */}
              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border-l-8 border-l-emerald-500"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600/20" />
                    </div>
                    <h4 className="text-2xl font-black text-neutral-900">Recommended Treatment</h4>
                  </div>
                  <p className="text-lg text-neutral-600 leading-relaxed font-bold">
                    {TREATMENT_DB[prediction.diseaseKey]?.treatment || "Please consult a local agricultural specialist immediately for a detailed chemical map."}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"></div>
                    <div className="flex items-center space-x-3 mb-6 relative z-10">
                      <Droplets className="w-6 h-6 text-emerald-400" />
                      <h4 className="text-xl font-black">Prevention Tips</h4>
                    </div>
                    <ul className="space-y-4 relative z-10">
                      {(TREATMENT_DB[prediction.diseaseKey]?.prevention || ["Check local soil pH", "Optimize irrigation", "Use pest barriers"]).map((tip: string, i: number) => (
                        <li key={i} className="flex items-start space-x-3 text-neutral-400 text-sm font-medium">
                          <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Info className="w-6 h-6 text-emerald-600" />
                      <h4 className="text-xl font-extrabold text-neutral-900 font-black">Agronomist Note</h4>
                    </div>
                    <p className="text-sm text-neutral-500 font-bold leading-loose">
                      The pathology in this sample suggests high humidity exposure. Ensure your irrigation schedule is optimized for early mornings.
                    </p>
                    <button className="mt-8 text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center hover:translate-x-2 transition-transform">
                      Read Research Papers <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
