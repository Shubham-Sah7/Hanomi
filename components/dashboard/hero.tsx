"use client"

import React, { useState } from "react"
import { Upload, Play, Box, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      simulateUpload(file.name)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name)
    }
  }

  const simulateUpload = (filename: string) => {
    setSelectedFile(filename)
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsUploading(false), 800)
          return 100
        }
        return prev + 10
      })
    }, 120)
  }

  return (
    <section className="relative w-full rounded-xl border border-border bg-card/10 overflow-hidden font-sans p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-center">
      {/* Background CAD Grids */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.05] pointer-events-none"></div>
      <div className="absolute inset-0 scan-line opacity-[0.2] pointer-events-none"></div>
      
      {/* Info Panel */}
      <div className="flex-1 flex flex-col gap-4 relative z-10 text-left">
        {/* Engineering Tagline */}
        <div className="flex items-center gap-2 w-max px-2.5 py-0.5 rounded-full bg-sky-950/50 border border-sky-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">AI engine online: asme standards active</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight max-w-lg">
          Generate Manufacturing-Ready Drawings in Minutes
        </h1>
        
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
          Upload 3D CAD files (.STEP, .IGES, .SolidWorks) and let Hanomi AI automatically generate fully annotated 2D technical layouts with GD&T callouts conforming to ASME Y14.5 and ISO 1101.
        </p>

        <div className="flex items-center gap-3.5 mt-2 flex-wrap">
          {/* Hidden File Input */}
          <input
            id="cad-upload-input"
            type="file"
            accept=".step,.stp,.igs,.iges,.sldprt,.ipt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            onClick={() => document.getElementById("cad-upload-input")?.click()}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs py-2 px-4 shadow-[0_4px_14px_rgba(14,165,233,0.3)] transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CAD Model
          </Button>
          <Button 
            variant="outline" 
            className="border-border hover:bg-muted/40 text-foreground font-semibold text-xs py-2 px-4 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 mr-2 text-sky-400" />
            Watch Demo
          </Button>
        </div>

        {/* CAD Standards Info Bar */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
          <div>
            <span className="text-foreground font-bold">COMPLIANCE:</span> ASME Y14.5, ISO 1101, DIN ISO 2768
          </div>
          <div className="h-3 w-px bg-border/50"></div>
          <div>
            <span className="text-foreground font-bold">REDUCING:</span> Tolerance Stack Errors by 98%
          </div>
        </div>
      </div>

      {/* CAD Drag & Drop Zone Card */}
      <div className="w-full lg:w-[380px] shrink-0 relative z-10">
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("cad-upload-input")?.click()}
          className={`w-full h-[220px] rounded-xl border border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer relative group overflow-hidden ${
            dragActive 
              ? "border-sky-400 bg-sky-950/20 shadow-[0_0_20px_rgba(14,165,233,0.15)]" 
              : "border-border bg-card/40 hover:border-sky-500/50 hover:bg-muted/10"
          }`}
        >
          {/* Engineering coordinate indicator X-Y-Z in background */}
          <div className="absolute top-3 right-3 text-[9px] font-mono text-muted-foreground/30 flex flex-col items-end pointer-events-none select-none">
            <div>POS_Z: [0.00, 0.00, 1.00]</div>
            <div>SCALE: [1.00 : 1.00]</div>
          </div>

          <div className="absolute bottom-3 left-3 flex gap-1 pointer-events-none select-none">
            <span className="px-1.5 py-0.5 text-[8px] font-mono bg-sky-950/50 text-sky-400 border border-sky-900/40 rounded">STEP</span>
            <span className="px-1.5 py-0.5 text-[8px] font-mono bg-sky-950/50 text-sky-400 border border-sky-900/40 rounded">IGES</span>
            <span className="px-1.5 py-0.5 text-[8px] font-mono bg-sky-950/50 text-sky-400 border border-sky-900/40 rounded">SLDPRT</span>
          </div>

          {selectedFile ? (
            <div className="flex flex-col items-center justify-center gap-3 w-full animate-fade-in">
              <div className="w-12 h-12 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center relative">
                {isUploading ? (
                  <div className="absolute inset-0 border-2 border-sky-500/20 border-t-sky-400 rounded-lg animate-spin"></div>
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                )}
                <Box className="w-5 h-5 text-sky-400" />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-[240px]">
                <span className="text-xs font-semibold text-foreground truncate">{selectedFile}</span>
                {isUploading ? (
                  <>
                    <span className="text-[10px] text-muted-foreground font-mono">Parsing CAD features... {uploadProgress}%</span>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-sky-400 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                      CAD analyzed successfully
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">Click to replace file</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted/40 border border-border group-hover:border-sky-500/30 flex items-center justify-center transition-all duration-300 relative">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-sky-400 transition-colors" />
                {/* Visual grid inside upload icon border */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none"></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground group-hover:text-sky-400 transition-colors">
                  Drag 3D model here, or <span className="underline text-sky-400">browse</span>
                </span>
                <span className="text-[10px] text-muted-foreground max-w-[200px] leading-normal">
                  Supported formats: STEP, STP, IGS, IGES, SLDPRT up to 150MB
                </span>
              </div>
            </div>
          )}

          {/* Interactive corner highlights (photoshop style anchors) */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-border/80 group-hover:border-sky-400 transition-colors"></div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-border/80 group-hover:border-sky-400 transition-colors"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-border/80 group-hover:border-sky-400 transition-colors"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-border/80 group-hover:border-sky-400 transition-colors"></div>
        </div>
      </div>
    </section>
  )
}
