"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Download, Share2, RefreshCw, FileText, Check, Printer, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "blueprint" | "model" | "projection" | "thinking" | "drawing" | "review" | "complete"

const PARTS = [
  { id: "motor",   label: "Motor Housing",   sub: "18 parts · 146 features" },
  { id: "valve",   label: "Valve Body",      sub: "9 parts · 84 features"  },
  { id: "gearbox", label: "Gearbox Cover",   sub: "12 parts · 108 features" },
  { id: "turbine", label: "Turbine Bracket", sub: "6 parts · 52 features"  },
]

// ─── Background grid ──────────────────────────────────────────────────────────

function Grid({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <div className="absolute inset-0 dots-grid" />
      <div className="absolute inset-0 blueprint-grid opacity-50" />
      {/* Corner registration marks */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden fill="none">
        {[
          [[26,26],[62,26],[26,26],[26,62]],
          [["calc(100% - 26px)",26],["calc(100% - 62px)",26],["calc(100% - 26px)",26],["calc(100% - 26px)",62]],
        ].map(() => null)}
        <g stroke="#1C1917" strokeWidth="0.8" opacity="0.13">
          <path d="M26 62 L26 26 L62 26" />
          <path d="M26 50 L26 26 L50 26" opacity="0" />
        </g>
        {/* Simplified corners using rects */}
        <rect x="14" y="14" width="38" height="1" fill="#1C1917" opacity="0.1" />
        <rect x="14" y="14" width="1" height="38" fill="#1C1917" opacity="0.1" />
        <rect x="14" y="14" width="16" height="0.5" fill="#1C1917" opacity="0.08" />
      </svg>
    </div>
  )
}

// ─── Motor housing SVG (premium isometric) ────────────────────────────────────

function MotorHousing({ rotX = -16, rotY = 28, style }: { rotX?: number; rotY?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ perspective: "700px", perspectiveOrigin: "50% 42%", ...style }}>
      <div style={{
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: "transform 0.05s linear",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}>
        <svg viewBox="0 0 340 300" fill="none" className="w-full h-full" style={{ filter: "drop-shadow(0 8px 24px rgba(28,25,23,0.10)) drop-shadow(0 2px 6px rgba(28,25,23,0.06))" }}>
          {/* Shadow ellipse */}
          <ellipse cx="195" cy="278" rx="90" ry="7" fill="#1C1917" opacity="0.06" />
          {/* Right face */}
          <polygon points="260,110 300,85 300,198 260,224" fill="#C2BCB4" stroke="#A09A92" strokeWidth="0.8" />
          {/* Front face */}
          <polygon points="100,110 260,110 260,224 100,224" fill="#D6D0C9" stroke="#A09A92" strokeWidth="0.8" />
          {/* Top face */}
          <polygon points="100,110 260,110 300,85 140,85" fill="#EAE6E0" stroke="#A09A92" strokeWidth="0.8" />
          {/* Flange bottom - front */}
          <polygon points="86,224 274,224 274,244 86,244" fill="#CEC8C0" stroke="#A09A92" strokeWidth="0.8" />
          {/* Flange bottom - right */}
          <polygon points="274,224 314,199 314,219 274,244" fill="#B8B2A9" stroke="#A09A92" strokeWidth="0.8" />
          {/* Flange top connection lines */}
          <line x1="86" y1="224" x2="100" y2="224" stroke="#A09A92" strokeWidth="0.7" />
          <line x1="274" y1="224" x2="260" y2="224" stroke="#A09A92" strokeWidth="0.7" />
          <line x1="314" y1="199" x2="300" y2="198" stroke="#A09A92" strokeWidth="0.7" />
          {/* Central bore */}
          <ellipse cx="180" cy="167" rx="38" ry="38" fill="#4A4540" stroke="#A09A92" strokeWidth="0.9" />
          <ellipse cx="180" cy="167" rx="28" ry="28" fill="#3A3530" stroke="#6B635C" strokeWidth="0.7" />
          <ellipse cx="180" cy="167" rx="18" ry="18" fill="#2A2520" />
          <ellipse cx="180" cy="167" rx="6" ry="6" fill="#1C1917" />
          {/* Top boss */}
          <ellipse cx="200" cy="96" rx="34" ry="13" fill="#4A4540" stroke="#7A7470" strokeWidth="0.7" />
          <ellipse cx="200" cy="96" rx="24" ry="9" fill="#3A3530" />
          <ellipse cx="152" cy="91" rx="6" ry="2.5" fill="#5A5550" stroke="#7A7470" strokeWidth="0.5" />
          <ellipse cx="250" cy="91" rx="6" ry="2.5" fill="#5A5550" stroke="#7A7470" strokeWidth="0.5" />
          {/* Corner mounting holes */}
          <ellipse cx="118" cy="130" rx="7" ry="7" fill="#4A4540" stroke="#A09A92" strokeWidth="0.8" />
          <ellipse cx="118" cy="130" rx="3.5" ry="3.5" fill="#2A2520" />
          <ellipse cx="242" cy="130" rx="7" ry="7" fill="#4A4540" stroke="#A09A92" strokeWidth="0.8" />
          <ellipse cx="242" cy="130" rx="3.5" ry="3.5" fill="#2A2520" />
          <ellipse cx="118" cy="204" rx="7" ry="7" fill="#4A4540" stroke="#A09A92" strokeWidth="0.8" />
          <ellipse cx="118" cy="204" rx="3.5" ry="3.5" fill="#2A2520" />
          <ellipse cx="242" cy="204" rx="7" ry="7" fill="#4A4540" stroke="#A09A92" strokeWidth="0.8" />
          <ellipse cx="242" cy="204" rx="3.5" ry="3.5" fill="#2A2520" />
          {/* Right face circular hole (hidden) */}
          <ellipse cx="295" cy="155" rx="14" ry="38" fill="none" stroke="#A09A92" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4" />
          {/* Highlight edge */}
          <line x1="100" y1="110" x2="260" y2="110" stroke="#F0EDE8" strokeWidth="0.9" opacity="0.7" />
          {/* Datum annotation */}
          <g transform="translate(22,258)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#F47A20" strokeWidth="0.9" />
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#3B8C3B" strokeWidth="0.9" />
            <line x1="0" y1="0" x2="-13" y2="9" stroke="#4A7CB0" strokeWidth="0.9" />
            <text x="22" y="4" fontSize="6" fill="#F47A20">X</text>
            <text x="2" y="-22" fontSize="6" fill="#3B8C3B">Z</text>
            <text x="-24" y="16" fontSize="6" fill="#4A7CB0">Y</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

// ─── Magnetic button hook ─────────────────────────────────────────────────────

function useMagnetic(strength = 0.28) {
  const ref = useRef<HTMLButtonElement>(null)
  const [xy, setXY] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    setXY({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength })
    setActive(true)
  }, [strength])
  const onLeave = useCallback(() => { setXY({ x: 0, y: 0 }); setActive(false) }, [])
  const style = { transform: `translate(${xy.x}px, ${xy.y}px)`, transition: active ? "transform 0.1s linear" : "transform 0.5s cubic-bezier(0.23,1,0.32,1)" }
  return { ref, style, onMouseMove: onMove, onMouseLeave: onLeave }
}

// ─── Stage 1: Blueprint workspace ─────────────────────────────────────────────

function BlueprintStage({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden select-none">
      <Grid />
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Center prompt */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl border border-border bg-card flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
              <rect x="4" y="4" width="20" height="20" stroke="#D4CEC8" strokeWidth="0.9" rx="0.5" />
              <circle cx="14" cy="14" r="5" stroke="#D4CEC8" strokeWidth="0.8" />
              <line x1="14" y1="2" x2="14" y2="26" stroke="#F47A20" strokeWidth="0.6" strokeDasharray="2,1.5" opacity="0.5" />
              <line x1="2" y1="14" x2="26" y2="14" stroke="#F47A20" strokeWidth="0.6" strokeDasharray="2,1.5" opacity="0.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[15px] font-medium text-foreground tracking-tight">Drop a CAD model</p>
            <p className="text-sm text-muted-foreground mt-1">or choose a demo part below</p>
          </div>
        </div>

        {/* Demo part grid */}
        <div className="grid grid-cols-4 gap-3">
          {PARTS.map(part => (
            <button
              key={part.id}
              onClick={() => onSelect(part.id)}
              onMouseEnter={() => setHovered(part.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-2xl border bg-card text-center transition-all duration-200",
                hovered === part.id
                  ? "border-primary/30 shadow-[0_2px_12px_rgba(244,122,32,0.08)] -translate-y-0.5"
                  : "border-border shadow-none hover:border-primary/20"
              )}
              style={{ transition: "all 0.18s cubic-bezier(0.23,1,0.32,1)" }}
            >
              {/* Engineering line illustration */}
              <div className="w-16 h-12 relative">
                <PartIllustration id={part.id} active={hovered === part.id} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{part.label}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{part.sub}</p>
              </div>
              {hovered === part.id && (
                <span className="absolute bottom-2 right-2 text-[9px] text-primary font-mono opacity-70">Try →</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase opacity-50">
          ASME Y14.5 · ISO 1101 · DIN 2768
        </p>
      </div>
    </div>
  )
}

function PartIllustration({ id, active }: { id: string; active: boolean }) {
  const c = active ? "#F47A20" : "#C8C2BA"
  const cl = active ? "#F47A20" : "#D4CEC8"
  if (id === "motor") return (
    <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
      <rect x="8" y="8" width="48" height="32" stroke={c} strokeWidth="0.9" rx="0.5" />
      <circle cx="32" cy="24" r="10" stroke={c} strokeWidth="0.8" />
      <circle cx="32" cy="24" r="4" stroke={cl} strokeWidth="0.6" />
      <line x1="32" y1="2" x2="32" y2="46" stroke={cl} strokeWidth="0.5" strokeDasharray="2,1.5" opacity="0.6" />
      <line x1="2" y1="24" x2="62" y2="24" stroke={cl} strokeWidth="0.5" strokeDasharray="2,1.5" opacity="0.6" />
      <circle cx="14" cy="14" r="2.5" stroke={c} strokeWidth="0.7" />
      <circle cx="50" cy="14" r="2.5" stroke={c} strokeWidth="0.7" />
      <circle cx="14" cy="34" r="2.5" stroke={c} strokeWidth="0.7" />
      <circle cx="50" cy="34" r="2.5" stroke={c} strokeWidth="0.7" />
    </svg>
  )
  if (id === "valve") return (
    <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
      <circle cx="32" cy="24" r="16" stroke={c} strokeWidth="0.9" />
      <circle cx="32" cy="24" r="6" stroke={c} strokeWidth="0.7" />
      <rect x="28" y="2" width="8" height="12" stroke={c} strokeWidth="0.7" rx="0.5" />
      <rect x="28" y="34" width="8" height="12" stroke={c} strokeWidth="0.7" rx="0.5" />
      <line x1="32" y1="2" x2="32" y2="46" stroke={cl} strokeWidth="0.4" strokeDasharray="2,1.5" opacity="0.5" />
      <line x1="2" y1="24" x2="62" y2="24" stroke={cl} strokeWidth="0.4" strokeDasharray="2,1.5" opacity="0.5" />
    </svg>
  )
  if (id === "gearbox") return (
    <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
      <rect x="6" y="6" width="52" height="36" stroke={c} strokeWidth="0.9" rx="0.5" />
      <rect x="14" y="14" width="36" height="20" stroke={cl} strokeWidth="0.6" strokeDasharray="2,1.5" />
      <circle cx="22" cy="24" r="5" stroke={c} strokeWidth="0.8" />
      <circle cx="42" cy="24" r="5" stroke={c} strokeWidth="0.8" />
      <line x1="22" y1="24" x2="42" y2="24" stroke={cl} strokeWidth="0.4" strokeDasharray="2,1.5" opacity="0.7" />
      <circle cx="32" cy="24" r="1.5" fill={c} />
    </svg>
  )
  return (
    <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
      <polyline points="8,8 8,40 56,40" stroke={c} strokeWidth="0.9" />
      <polyline points="8,8 24,8 24,40" stroke={c} strokeWidth="0.9" />
      <circle cx="16" cy="18" r="3" stroke={c} strokeWidth="0.7" />
      <circle cx="16" cy="30" r="3" stroke={c} strokeWidth="0.7" />
      <circle cx="36" cy="36" r="3" stroke={c} strokeWidth="0.7" />
      <circle cx="50" cy="36" r="3" stroke={c} strokeWidth="0.7" />
      <line x1="16" y1="2" x2="16" y2="46" stroke={cl} strokeWidth="0.4" strokeDasharray="2,1.5" opacity="0.5" />
      <line x1="2" y1="40" x2="62" y2="40" stroke={cl} strokeWidth="0.4" strokeDasharray="2,1.5" opacity="0.5" />
    </svg>
  )
}

// ─── Stage 2: 3D Model ────────────────────────────────────────────────────────

function ModelStage({ partId, onGenerate }: { partId: string; onGenerate: () => void }) {
  const part = PARTS.find(p => p.id === partId)!
  const [rotX, setRotX] = useState(-16)
  const [rotY, setRotY] = useState(28)
  const [dragging, setDragging] = useState(false)
  const [dragged, setDragged] = useState(false)
  const last = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const mag = useMagnetic()

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setRotY(y => y + dx * 0.45)
      setRotX(x => Math.max(-55, Math.min(10, x - dy * 0.3)))
      setDragged(true)
    })
  }, [dragging])

  const onMouseUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    if (!dragging) return
    const up = () => setDragging(false)
    window.addEventListener("mouseup", up)
    return () => window.removeEventListener("mouseup", up)
  }, [dragging])

  return (
    <div className="h-full flex flex-col items-center justify-between p-10 relative overflow-hidden select-none">
      <Grid opacity={0.6} />
      <div className="relative z-10 w-full flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center gap-1 mt-2">
          <p className="text-xs font-medium text-muted-foreground font-mono">{part.sub}</p>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{part.label}</h2>
        </div>

        {/* 3D model */}
        <div
          className="relative w-72 h-60 cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <MotorHousing rotX={rotX} rotY={rotY} style={{ width: "100%", height: "100%" }} />
          {!dragged && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-card/80 border border-border rounded-full shadow-sm animate-fade-in">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6 L8 2 L12 6 M8 2 L8 14" />
              </svg>
              <span className="text-[10px] text-muted-foreground">Drag to inspect</span>
            </div>
          )}
        </div>

        {/* Generate button */}
        <div className="flex flex-col items-center gap-4">
          <button
            ref={mag.ref}
            onMouseMove={mag.onMouseMove}
            onMouseLeave={mag.onMouseLeave}
            onClick={onGenerate}
            style={mag.style}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-2xl shadow-md flex items-center gap-2.5 transition-colors"
          >
            Generate Drawing
            <span className="text-base leading-none">→</span>
          </button>
          <p className="text-[10px] text-muted-foreground font-mono">
            ASME Y14.5 · Orthographic · GD&amp;T · Section Views
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Stage 3: Projection Animation ────────────────────────────────────────────

const PROJ_STEPS = [
  { ms: 0,    key: "rotate"    },
  { ms: 900,  key: "lines"     },
  { ms: 1700, key: "front"     },
  { ms: 2400, key: "top"       },
  { ms: 3000, key: "side"      },
  { ms: 3600, key: "section"   },
  { ms: 4200, key: "centers"   },
  { ms: 5000, key: "done"      },
]

function ProjectionStage({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = PROJ_STEPS.map(({ ms, key }, i) =>
      setTimeout(() => setStep(i), ms)
    )
    const t = setTimeout(onDone, 5200)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [onDone])

  const has = (k: string) => step >= PROJ_STEPS.findIndex(s => s.key === k)

  return (
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      <Grid opacity={0.4} />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 900 560" className="w-full h-full max-w-4xl" fill="none">
          {/* ── 3D Model (left) ── */}
          <g transform="translate(60,160)">
            <g style={{ transition: "transform 2s cubic-bezier(0.23,1,0.32,1)", transform: has("rotate") ? "rotate(8deg)" : "rotate(0deg)" }}>
              {/* Simplified isometric box */}
              <polygon points="180,60 220,38 220,150 180,172" fill="#C2BCB4" stroke="#A09A92" strokeWidth="0.8" />
              <polygon points="60,60 180,60 180,172 60,172" fill="#D6D0C9" stroke="#A09A92" strokeWidth="0.8" />
              <polygon points="60,60 180,60 220,38 100,38" fill="#EAE6E0" stroke="#A09A92" strokeWidth="0.8" />
              <ellipse cx="120" cy="116" rx="28" ry="28" fill="#4A4540" stroke="#A09A92" strokeWidth="0.8" />
              <ellipse cx="120" cy="116" rx="14" ry="14" fill="#2A2520" />
              <ellipse cx="128" cy="46" rx="24" ry="9" fill="#4A4540" stroke="#7A7470" strokeWidth="0.6" />
              <circle cx="72" cy="80" r="5" fill="#4A4540" stroke="#A09A92" strokeWidth="0.7" />
              <circle cx="168" cy="80" r="5" fill="#4A4540" stroke="#A09A92" strokeWidth="0.7" />
              <circle cx="72" cy="152" r="5" fill="#4A4540" stroke="#A09A92" strokeWidth="0.7" />
              <circle cx="168" cy="152" r="5" fill="#4A4540" stroke="#A09A92" strokeWidth="0.7" />
            </g>
          </g>

          {/* ── Projection lines ── */}
          {has("lines") && (
            <g stroke="#F47A20" strokeWidth="0.8" strokeDasharray="6,3" opacity="0.7">
              <line x1="280" y1="220" x2="430" y2="220" style={{ strokeDashoffset: has("front") ? 0 : 40, transition: "stroke-dashoffset 0.6s ease-out" }} />
              <line x1="280" y1="280" x2="430" y2="280" style={{ strokeDashoffset: has("front") ? 0 : 40, transition: "stroke-dashoffset 0.6s ease-out 0.1s" }} />
              <line x1="180" y1="160" x2="180" y2="50" style={{ strokeDashoffset: has("top") ? 0 : 30, transition: "stroke-dashoffset 0.6s ease-out 0.2s" }} />
              <line x1="240" y1="160" x2="240" y2="50" style={{ strokeDashoffset: has("top") ? 0 : 30, transition: "stroke-dashoffset 0.6s ease-out 0.3s" }} />
            </g>
          )}

          {/* ── Drawing sheet ── */}
          {has("front") && (
            <g>
              <rect x="430" y="60" width="430" height="440" fill="white" stroke="#D4CEC8" strokeWidth="1" style={{ opacity: has("front") ? 1 : 0, transition: "opacity 0.4s" }} />
              <rect x="443" y="73" width="404" height="414" fill="none" stroke="#D4CEC8" strokeWidth="0.4" />
            </g>
          )}

          {/* ── Front view ── */}
          {has("front") && (
            <g style={{ opacity: has("front") ? 1 : 0, transition: "opacity 0.5s" }}>
              <rect x="470" y="190" width="180" height="110" stroke="#1C1917" strokeWidth="1" fill="none" />
              <rect x="450" y="300" width="220" height="16" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="560" cy="245" r="28" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="490" cy="202" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="640" cy="202" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="490" cy="294" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="640" cy="294" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <text x="560" y="336" textAnchor="middle" fontSize="7" fill="#78716C" letterSpacing="1">FRONT VIEW</text>
            </g>
          )}

          {/* ── Top view ── */}
          {has("top") && (
            <g style={{ opacity: has("top") ? 1 : 0, transition: "opacity 0.5s" }}>
              <rect x="470" y="90" width="180" height="75" stroke="#1C1917" strokeWidth="1" fill="none" />
              <circle cx="560" cy="128" r="28" stroke="#1C1917" strokeWidth="0.5" strokeDasharray="4,2" fill="none" />
              <circle cx="490" cy="98" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="640" cy="98" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="490" cy="158" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <circle cx="640" cy="158" r="7" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <text x="560" y="84" textAnchor="middle" fontSize="7" fill="#78716C" letterSpacing="1">TOP VIEW</text>
            </g>
          )}

          {/* ── Side view ── */}
          {has("side") && (
            <g style={{ opacity: has("side") ? 1 : 0, transition: "opacity 0.5s" }}>
              <rect x="680" y="190" width="90" height="110" stroke="#1C1917" strokeWidth="1" fill="none" />
              <rect x="668" y="300" width="114" height="16" stroke="#1C1917" strokeWidth="0.9" fill="none" />
              <text x="725" y="336" textAnchor="middle" fontSize="7" fill="#78716C" letterSpacing="1">SIDE</text>
            </g>
          )}

          {/* ── Section line ── */}
          {has("section") && (
            <g style={{ opacity: has("section") ? 1 : 0, transition: "opacity 0.4s" }}>
              <line x1="467" y1="245" x2="480" y2="245" stroke="#1C1917" strokeWidth="1" />
              <line x1="640" y1="245" x2="653" y2="245" stroke="#1C1917" strokeWidth="1" />
              <text x="461" y="243" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
              <text x="655" y="243" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
              <polygon points="471,245 465,241 465,249" fill="#1C1917" />
              <polygon points="649,245 655,241 655,249" fill="#1C1917" />
            </g>
          )}

          {/* ── Center lines ── */}
          {has("centers") && (
            <g stroke="#F47A20" strokeWidth="0.6" strokeDasharray="8,3,2,3" opacity="0.7" style={{ opacity: has("centers") ? 0.7 : 0, transition: "opacity 0.5s" }}>
              <line x1="458" y1="245" x2="662" y2="245" />
              <line x1="560" y1="80" x2="560" y2="340" />
              <line x1="673" y1="185" x2="673" y2="330" />
              <line x1="458" y1="128" x2="662" y2="128" />
            </g>
          )}

          {/* Status label */}
          <text x="450" y="510" fontSize="8" fill="#78716C" fontFamily="monospace">
            {has("centers") ? "✓ Views complete · Applying dimensions…" :
             has("section") ? "Section A-A drawn" :
             has("side")    ? "Side view projected" :
             has("top")     ? "Top view projected" :
             has("front")   ? "Front view projected" :
             has("lines")   ? "Projection lines extending…" :
             "Rotating to isometric…"}
          </text>
        </svg>
      </div>
    </div>
  )
}

// ─── Stage 4: AI Thinking ─────────────────────────────────────────────────────

const THINK_ITEMS = [
  "Reading STEP geometry",
  "Detecting holes",
  "Detecting pockets",
  "Detecting chamfers",
  "Detecting fillets",
  "Finding datum references",
  "Understanding symmetry",
  "Mapping manufacturing intent",
  "Applying ASME Y14.5",
  "Applying ISO 1101",
]

function ThinkingStage({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const timers = THINK_ITEMS.map((_, i) => setTimeout(() => setVisible(i + 1), i * 360 + 200))
    const t = setTimeout(onDone, THINK_ITEMS.length * 360 + 600)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [onDone])

  const pct = Math.round((visible / THINK_ITEMS.length) * 100)

  return (
    <div className="h-full flex items-center justify-center p-8 relative overflow-hidden">
      <Grid opacity={0.5} />
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="text-xs text-primary font-medium">Hanomi is thinking</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">AI Feature Detection</h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">motor_housing_v12.step</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Analysis Log</span>
            <span className="text-[10px] font-mono text-muted-foreground">{pct}%</span>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {THINK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 transition-all duration-300"
                style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "translateX(0)" : "translateX(-6px)" }}
              >
                <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200",
                  i < visible ? "bg-primary/10 border-primary/25" : "bg-muted border-border")}>
                  {i < visible && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={2.5} />}
                </div>
                <span className="text-sm text-foreground">{item}</span>
                {i < visible && <span className="ml-auto text-[10px] text-emerald-600 font-mono shrink-0">done</span>}
              </div>
            ))}
          </div>
          <div className="h-0.5 bg-muted">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stage 5: Drawing Builds Live ─────────────────────────────────────────────

interface DV {
  border: boolean; front: boolean; top: boolean; side: boolean
  hidden: boolean; centers: boolean; dims: boolean; leaders: boolean
  holeTable: boolean; section: boolean; gdt: boolean; tolerance: boolean
  revision: boolean; title: boolean
}

const DRAW_STEPS: { ms: number; key: keyof DV }[] = [
  { ms: 0,    key: "border"    },
  { ms: 500,  key: "front"     },
  { ms: 1000, key: "top"       },
  { ms: 1500, key: "side"      },
  { ms: 2000, key: "hidden"    },
  { ms: 2500, key: "centers"   },
  { ms: 3000, key: "dims"      },
  { ms: 3500, key: "leaders"   },
  { ms: 3900, key: "holeTable" },
  { ms: 4300, key: "section"   },
  { ms: 4800, key: "gdt"       },
  { ms: 5300, key: "tolerance" },
  { ms: 5700, key: "revision"  },
  { ms: 6100, key: "title"     },
]

function DrawingStage({ onDone }: { onDone: () => void }) {
  const [dv, setDv] = useState<DV>({
    border: false, front: false, top: false, side: false,
    hidden: false, centers: false, dims: false, leaders: false,
    holeTable: false, section: false, gdt: false, tolerance: false,
    revision: false, title: false,
  })
  const [label, setLabel] = useState("Starting…")

  const LABELS: Partial<Record<keyof DV, string>> = {
    border: "Drawing sheet…", front: "Front view…", top: "Top view…",
    side: "Side view…", hidden: "Hidden lines…", centers: "Center lines…",
    dims: "Placing dimensions…", leaders: "Leader lines…",
    holeTable: "Hole table…", section: "Section A-A…",
    gdt: "GD&T annotations…", tolerance: "Tolerance block…",
    revision: "Revision table…", title: "Title block…",
  }

  useEffect(() => {
    const timers = DRAW_STEPS.map(({ ms, key }) =>
      setTimeout(() => {
        setDv(p => ({ ...p, [key]: true }))
        if (LABELS[key]) setLabel(LABELS[key]!)
      }, ms)
    )
    const t = setTimeout(onDone, 7000)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [onDone])

  const pct = Math.round((DRAW_STEPS.filter(s => dv[s.key]).length / DRAW_STEPS.length) * 100)

  function fade(key: keyof DV) {
    return { opacity: dv[key] ? 1 : 0, transition: "opacity 0.35s ease-in" }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="h-8 border-b border-border bg-card flex items-center px-5 gap-4 shrink-0">
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono font-semibold text-foreground">{pct}%</span>
      </div>

      {/* Drawing */}
      <div className="flex-1 bg-muted/30 flex items-center justify-center p-6 overflow-hidden">
        <div className="bg-white shadow-sm border border-border" style={{ maxWidth: "min(820px, 100%)", width: "100%" }}>
          <svg viewBox="0 0 820 580" className="w-full" style={{ fontFamily: "monospace" }}>
            <defs>
              <pattern id="h45" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="#1C1917" strokeWidth="0.55" opacity="0.4" />
              </pattern>
            </defs>

            {/* Border */}
            <g style={fade("border")}>
              <rect x="2" y="2" width="816" height="576" fill="white" stroke="#1C1917" strokeWidth="1.5" />
              <rect x="14" y="14" width="792" height="552" fill="none" stroke="#1C1917" strokeWidth="0.5" />
              <text x="70" y="508" fontSize="6" fill="#9E988F">TOLERANCES UNLESS NOTED: LINEAR ±0.1 · ANGULAR ±0.5°</text>
            </g>

            {/* Front view */}
            <g style={fade("front")}>
              <rect x="120" y="185" width="240" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <rect x="100" y="340" width="280" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <line x1="100" y1="340" x2="120" y2="340" stroke="#1C1917" strokeWidth="1.2" />
              <line x1="360" y1="340" x2="380" y2="340" stroke="#1C1917" strokeWidth="1.2" />
              <circle cx="240" cy="262" r="38" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <circle cx="142" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="338" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="142" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="338" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <text x="240" y="375" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
            </g>

            {/* Top view */}
            <g style={fade("top")}>
              <rect x="120" y="55" width="240" height="100" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <circle cx="142" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="338" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="142" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="338" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
              <circle cx="240" cy="105" r="38" fill="none" stroke="#1C1917" strokeWidth="0.6" strokeDasharray="4,2" />
              <text x="240" y="22" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
            </g>

            {/* Side view */}
            <g style={fade("side")}>
              <rect x="425" y="185" width="125" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <rect x="410" y="340" width="155" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <text x="487" y="375" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">RIGHT VIEW</text>
            </g>

            {/* Hidden lines */}
            <g style={fade("hidden")} stroke="#1C1917" strokeWidth="0.65" strokeDasharray="5,3" opacity="0.55">
              <rect x="152" y="208" width="176" height="108" fill="none" />
              <circle cx="240" cy="262" r="26" fill="none" />
              <line x1="449" y1="224" x2="449" y2="300" />
              <line x1="531" y1="224" x2="531" y2="300" />
            </g>

            {/* Center lines */}
            <g style={fade("centers")} stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4">
              <line x1="108" y1="262" x2="380" y2="262" />
              <line x1="240" y1="172" x2="240" y2="385" />
              <line x1="108" y1="105" x2="380" y2="105" />
              <line x1="240" y1="43" x2="240" y2="167" />
              <line x1="487" y1="165" x2="487" y2="375" />
            </g>

            {/* Dimensions */}
            <g style={fade("dims")} fill="#F47A20" stroke="#F47A20">
              <line x1="120" y1="398" x2="360" y2="398" strokeWidth="0.6" />
              <line x1="120" y1="392" x2="120" y2="404" strokeWidth="0.6" />
              <line x1="360" y1="392" x2="360" y2="404" strokeWidth="0.6" />
              <polygon points="120,398 126,396 126,400" />
              <polygon points="360,398 354,396 354,400" />
              <text x="240" y="412" textAnchor="middle" fontSize="7.5">240</text>
              <line x1="78" y1="185" x2="78" y2="340" strokeWidth="0.6" />
              <line x1="72" y1="185" x2="84" y2="185" strokeWidth="0.6" />
              <line x1="72" y1="340" x2="84" y2="340" strokeWidth="0.6" />
              <text x="68" y="266" textAnchor="middle" fontSize="7.5" transform="rotate(-90,68,266)">155</text>
              <line x1="100" y1="420" x2="380" y2="420" strokeWidth="0.6" />
              <line x1="100" y1="414" x2="100" y2="426" strokeWidth="0.6" />
              <line x1="380" y1="414" x2="380" y2="426" strokeWidth="0.6" />
              <text x="240" y="434" textAnchor="middle" fontSize="7.5">280</text>
              <line x1="407" y1="55" x2="407" y2="155" strokeWidth="0.6" />
              <text x="418" y="109" fontSize="7.5">100</text>
            </g>

            {/* Leaders */}
            <g style={fade("leaders")} fill="#F47A20" stroke="#F47A20">
              <line x1="255" y1="240" x2="292" y2="222" strokeWidth="0.6" />
              <line x1="292" y1="222" x2="340" y2="222" strokeWidth="0.6" />
              <text x="342" y="226" fontSize="7.5">⌀76</text>
              <line x1="150" y1="200" x2="175" y2="186" strokeWidth="0.6" />
              <line x1="175" y1="186" x2="222" y2="186" strokeWidth="0.6" />
              <text x="224" y="190" fontSize="7">⌀18 × 4</text>
            </g>

            {/* Hole table */}
            <g style={fade("holeTable")}>
              <rect x="598" y="185" width="174" height="14" fill="#F5F4F2" stroke="#1C1917" strokeWidth="0.6" />
              <rect x="598" y="199" width="174" height="13" fill="none" stroke="#1C1917" strokeWidth="0.5" />
              <rect x="598" y="212" width="174" height="13" fill="none" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="636" y1="185" x2="636" y2="225" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="682" y1="185" x2="682" y2="225" stroke="#1C1917" strokeWidth="0.5" />
              <text x="617" y="194" fontSize="5.5" fill="#78716C" textAnchor="middle">SYMBOL</text>
              <text x="659" y="194" fontSize="5.5" fill="#78716C" textAnchor="middle">SIZE</text>
              <text x="730" y="194" fontSize="5.5" fill="#78716C" textAnchor="middle">NOTES</text>
              <text x="617" y="208" fontSize="6" fill="#1C1917" textAnchor="middle">⌀18 × 4</text>
              <text x="659" y="208" fontSize="6" fill="#1C1917" textAnchor="middle">M16 CLR</text>
              <text x="730" y="208" fontSize="5.5" fill="#1C1917" textAnchor="middle">196 B.C.</text>
              <text x="617" y="221" fontSize="6" fill="#1C1917" textAnchor="middle">⌀76</text>
              <text x="659" y="221" fontSize="6" fill="#1C1917" textAnchor="middle">BORE</text>
              <text x="730" y="221" fontSize="5.5" fill="#1C1917" textAnchor="middle">H7 FIT</text>
              <text x="685" y="178" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.5">HOLE TABLE</text>
            </g>

            {/* Section A-A */}
            <g style={fade("section")}>
              <rect x="597" y="245" width="46" height="117" fill="url(#h45)" />
              <rect x="727" y="245" width="46" height="117" fill="url(#h45)" />
              <rect x="643" y="245" width="84" height="117" fill="white" />
              <rect x="597" y="245" width="176" height="117" fill="none" stroke="#1C1917" strokeWidth="1.2" />
              <line x1="643" y1="245" x2="643" y2="362" stroke="#1C1917" strokeWidth="1.2" />
              <line x1="727" y1="245" x2="727" y2="362" stroke="#1C1917" strokeWidth="1.2" />
              <text x="685" y="376" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">SECTION A-A</text>
              <line x1="467" y1="250" x2="480" y2="250" stroke="#1C1917" strokeWidth="1" />
              <line x1="360" y1="250" x2="373" y2="250" stroke="#1C1917" strokeWidth="1" />
              <text x="461" y="248" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
              <text x="375" y="248" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
            </g>

            {/* GD&T */}
            <g style={fade("gdt")} fill="none">
              <rect x="196" y="158" width="110" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
              <line x1="212" y1="158" x2="212" y2="172" stroke="#F47A20" strokeWidth="0.8" />
              <line x1="248" y1="158" x2="248" y2="172" stroke="#F47A20" strokeWidth="0.8" />
              <line x1="270" y1="158" x2="270" y2="172" stroke="#F47A20" strokeWidth="0.8" />
              <line x1="288" y1="158" x2="288" y2="172" stroke="#F47A20" strokeWidth="0.8" />
              <text x="204" y="168" fontSize="9" fill="#F47A20" textAnchor="middle">⌖</text>
              <text x="230" y="168" fontSize="6.5" fill="#F47A20" textAnchor="middle">⌀0.05</text>
              <text x="259" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
              <text x="279" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">B</text>
              <text x="297" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">C</text>
              <line x1="251" y1="172" x2="251" y2="185" stroke="#F47A20" strokeWidth="0.6" />
              <line x1="251" y1="185" x2="240" y2="185" stroke="#F47A20" strokeWidth="0.6" />
              <polygon points="240,185 240,182 237,185 240,188" fill="#F47A20" />
              <rect x="432" y="140" width="62" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
              <line x1="448" y1="140" x2="448" y2="154" stroke="#F47A20" strokeWidth="0.8" />
              <text x="440" y="150" fontSize="9" fill="#F47A20" textAnchor="middle">⏥</text>
              <text x="471" y="150" fontSize="6.5" fill="#F47A20" textAnchor="middle">0.02</text>
              <rect x="438" y="353" width="18" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
              <text x="447" y="363" fontSize="8" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
              <polygon points="447,367 442,375 452,375" fill="none" stroke="#F47A20" strokeWidth="0.8" />
            </g>

            {/* Tolerance block */}
            <g style={fade("tolerance")}>
              <rect x="14" y="490" width="580" height="24" fill="none" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="200" y1="490" x2="200" y2="514" stroke="#1C1917" strokeWidth="0.4" />
              <line x1="390" y1="490" x2="390" y2="514" stroke="#1C1917" strokeWidth="0.4" />
              <text x="107" y="500" fontSize="5.5" fill="#9E988F" textAnchor="middle">TOLERANCES UNLESS NOTED</text>
              <text x="107" y="508" fontSize="5.5" fill="#1C1917" textAnchor="middle">LINEAR ±0.1mm · ANGULAR ±0.5°</text>
              <text x="295" y="500" fontSize="5.5" fill="#9E988F" textAnchor="middle">SURFACE FINISH</text>
              <text x="295" y="508" fontSize="5.5" fill="#1C1917" textAnchor="middle">Ra 1.6 UNLESS NOTED</text>
              <text x="490" y="500" fontSize="5.5" fill="#9E988F" textAnchor="middle">MATERIAL</text>
              <text x="490" y="508" fontSize="5.5" fill="#1C1917" textAnchor="middle">Al 6061-T6 · Hard Anodized</text>
            </g>

            {/* Revision table */}
            <g style={fade("revision")}>
              <rect x="660" y="14" width="146" height="58" fill="none" stroke="#1C1917" strokeWidth="0.6" />
              <line x1="660" y1="26" x2="806" y2="26" stroke="#1C1917" strokeWidth="0.4" />
              <line x1="660" y1="42" x2="806" y2="42" stroke="#1C1917" strokeWidth="0.35" />
              <line x1="678" y1="26" x2="678" y2="72" stroke="#1C1917" strokeWidth="0.35" />
              <line x1="714" y1="26" x2="714" y2="72" stroke="#1C1917" strokeWidth="0.35" />
              <text x="666" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">REV</text>
              <text x="690" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">DATE</text>
              <text x="730" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">DESCRIPTION</text>
              <text x="668" y="37" fontSize="7" fill="#1C1917" fontWeight="600">A</text>
              <text x="681" y="37" fontSize="6" fill="#1C1917">11/06/26</text>
              <text x="717" y="37" fontSize="6" fill="#1C1917">Initial Release</text>
              <text x="733" y="14" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.5">REVISIONS</text>
            </g>

            {/* Title block */}
            <g style={fade("title")}>
              <rect x="14" y="514" width="792" height="62" fill="white" stroke="#1C1917" strokeWidth="0.7" />
              <line x1="260" y1="514" x2="260" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="370" y1="514" x2="370" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="470" y1="514" x2="470" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="540" y1="514" x2="540" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="620" y1="514" x2="620" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <line x1="680" y1="514" x2="680" y2="576" stroke="#1C1917" strokeWidth="0.5" />
              <text x="20" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">TITLE</text>
              <text x="20" y="561" fontSize="9.5" fill="#1C1917" fontWeight="600">Motor Housing Assembly</text>
              <text x="266" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">DWG NO.</text>
              <text x="266" y="561" fontSize="8.5" fill="#1C1917">PRJ-904-MH-001</text>
              <text x="376" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">SCALE</text>
              <text x="376" y="561" fontSize="9" fill="#1C1917">1 : 2</text>
              <text x="476" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">SHEET</text>
              <text x="476" y="561" fontSize="9" fill="#1C1917">1 of 3</text>
              <text x="546" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">DATE</text>
              <text x="546" y="561" fontSize="8" fill="#1C1917">11 Jun 2026</text>
              <text x="626" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">REV</text>
              <text x="626" y="561" fontSize="10" fill="#1C1917" fontWeight="700">A</text>
              <text x="766" y="538" fontSize="12" fill="#F47A20" fontWeight="700" textAnchor="middle" letterSpacing="1.5">HANOMI</text>
              <text x="766" y="552" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.3">Manufacturing Drawings</text>
              <text x="766" y="563" fontSize="5.5" fill="#9E988F" textAnchor="middle">ASME Y14.5 · ISO 1101</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Stage 6: Review ──────────────────────────────────────────────────────────

const REVIEW_ITEMS = [
  "184 dimensions verified",
  "42 GD&T annotations placed",
  "Manufacturing intent understood",
  "ASME Y14.5 compliant",
  "ISO 1101 compliant",
  "Ready for production",
]

function ReviewStage({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const timers = REVIEW_ITEMS.map((_, i) => setTimeout(() => setVisible(i + 1), i * 260 + 300))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="h-full flex items-center justify-center p-8 relative overflow-hidden">
      <Grid opacity={0.4} />
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 animate-fade-in">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">Review Complete</div>
          <h2 className="text-xl font-semibold text-foreground">Hanomi Review</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-assisted quality validation</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {REVIEW_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3.5 transition-all duration-300"
              style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "translateX(0)" : "translateX(-4px)" }}
            >
              <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Drafting time saved</p>
            <p className="text-xl font-semibold text-foreground font-mono mt-1">4.8 hrs</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">AI confidence</p>
            <p className="text-xl font-semibold text-foreground font-mono mt-1">99.4%</p>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
          style={{ opacity: visible >= REVIEW_ITEMS.length ? 1 : 0.4, pointerEvents: visible >= REVIEW_ITEMS.length ? "auto" : "none", transition: "opacity 0.3s" }}
        >
          View completed drawing
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Stage 7: Complete ────────────────────────────────────────────────────────

function CompleteStage({ onClose }: { onClose: () => void }) {
  const [drawn, setDrawn] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const CIRC = 2 * Math.PI * 22
  const CHECK = 36

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300)
    return () => clearTimeout(t)
  }, [])

  const doExport = (label: string) => {
    setExporting(label)
    setTimeout(() => setExporting(null), 1600)
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Grid fades */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25, transition: "opacity 1s ease-out" }}>
        <div className="absolute inset-0 dots-grid" />
      </div>

      {/* Completed drawing (full width) */}
      <div className="flex-1 bg-muted/20 flex items-center justify-center p-5 overflow-hidden">
        <div className="bg-white shadow-[0_2px_16px_rgba(28,25,23,0.08)] border border-border" style={{ maxWidth: "min(820px, 100%)", width: "100%" }}>
          <DrawingComplete />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border bg-card px-5 py-3 flex items-center gap-3">
        {/* Animated checkmark */}
        <div className="shrink-0">
          <svg viewBox="0 0 50 50" className="w-9 h-9">
            <circle cx="25" cy="25" r="22" fill="none" stroke="#F47A20" strokeWidth="1.8"
              strokeDasharray={CIRC} strokeDashoffset={drawn ? 0 : CIRC}
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.23,1,0.32,1)", transformOrigin: "center", transform: "rotate(-90deg)" }} />
            <polyline points="14,26 22,34 36,18" fill="none" stroke="#F47A20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={CHECK} strokeDashoffset={drawn ? 0 : CHECK}
              style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.23,1,0.32,1) 0.6s" }} />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Drawing generated in 14.2 seconds</p>
          <p className="text-xs text-muted-foreground">Ready for manufacturing · PRJ-904-MH-001 · Rev A</p>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {[
            { label: "Export PDF",  Icon: FileText,   primary: true  },
            { label: "Export DWG",  Icon: Download,   primary: false },
            { label: "Export DXF",  Icon: Download,   primary: false },
            { label: "Share",       Icon: Share2,     primary: false },
            { label: "Revision",    Icon: RefreshCw,  primary: false },
            { label: "Print",       Icon: Printer,    primary: false },
          ].map(({ label, Icon, primary }) => (
            <button key={label} onClick={() => doExport(label)}
              className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0",
                primary ? "bg-primary text-white hover:bg-primary/90" : "border border-border bg-card text-foreground hover:bg-muted")}>
              {exporting === label ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />}
              {exporting === label ? "…" : label}
            </button>
          ))}
          <button onClick={onClose} className="ml-1 px-3 py-2 rounded-xl text-xs text-muted-foreground border border-border hover:bg-muted transition-all">
            New Drawing
          </button>
        </div>
      </div>
    </div>
  )
}

function DrawingComplete() {
  const vis = { border:true, front:true, top:true, side:true, hidden:true, centers:true, dims:true, leaders:true, holeTable:true, section:true, gdt:true, tolerance:true, revision:true, title:true }
  // Reuse all SVG from DrawingStage with all flags enabled — inline minimal version
  return (
    <svg viewBox="0 0 820 580" className="w-full" style={{ fontFamily: "monospace" }}>
      <defs>
        <pattern id="h45c" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#1C1917" strokeWidth="0.55" opacity="0.4" />
        </pattern>
      </defs>
      <rect x="2" y="2" width="816" height="576" fill="white" stroke="#1C1917" strokeWidth="1.5" />
      <rect x="14" y="14" width="792" height="552" fill="none" stroke="#1C1917" strokeWidth="0.5" />
      <rect x="120" y="185" width="240" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <rect x="100" y="340" width="280" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <line x1="100" y1="340" x2="120" y2="340" stroke="#1C1917" strokeWidth="1.2" />
      <line x1="360" y1="340" x2="380" y2="340" stroke="#1C1917" strokeWidth="1.2" />
      <circle cx="240" cy="262" r="38" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <circle cx="142" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="338" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="142" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="338" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <text x="240" y="375" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
      <rect x="120" y="55" width="240" height="100" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <circle cx="240" cy="105" r="38" fill="none" stroke="#1C1917" strokeWidth="0.6" strokeDasharray="4,2" />
      <circle cx="142" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="338" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="142" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <circle cx="338" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
      <text x="240" y="22" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
      <rect x="425" y="185" width="125" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <rect x="410" y="340" width="155" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <text x="487" y="375" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">RIGHT VIEW</text>
      <g stroke="#1C1917" strokeWidth="0.65" strokeDasharray="5,3" opacity="0.55">
        <rect x="152" y="208" width="176" height="108" fill="none" />
        <circle cx="240" cy="262" r="26" fill="none" />
        <line x1="449" y1="224" x2="449" y2="300" />
        <line x1="531" y1="224" x2="531" y2="300" />
      </g>
      <g stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4">
        <line x1="108" y1="262" x2="380" y2="262" />
        <line x1="240" y1="172" x2="240" y2="385" />
        <line x1="108" y1="105" x2="380" y2="105" />
        <line x1="240" y1="43" x2="240" y2="167" />
        <line x1="487" y1="165" x2="487" y2="375" />
      </g>
      <g fill="#F47A20" stroke="#F47A20">
        <line x1="120" y1="398" x2="360" y2="398" strokeWidth="0.6" />
        <line x1="120" y1="392" x2="120" y2="404" strokeWidth="0.6" />
        <line x1="360" y1="392" x2="360" y2="404" strokeWidth="0.6" />
        <polygon points="120,398 126,396 126,400" />
        <polygon points="360,398 354,396 354,400" />
        <text x="240" y="412" textAnchor="middle" fontSize="7.5">240</text>
        <line x1="78" y1="185" x2="78" y2="340" strokeWidth="0.6" />
        <line x1="72" y1="185" x2="84" y2="185" strokeWidth="0.6" />
        <line x1="72" y1="340" x2="84" y2="340" strokeWidth="0.6" />
        <text x="68" y="266" textAnchor="middle" fontSize="7.5" transform="rotate(-90,68,266)">155</text>
        <line x1="100" y1="420" x2="380" y2="420" strokeWidth="0.6" />
        <line x1="100" y1="414" x2="100" y2="426" strokeWidth="0.6" />
        <line x1="380" y1="414" x2="380" y2="426" strokeWidth="0.6" />
        <text x="240" y="434" textAnchor="middle" fontSize="7.5">280</text>
        <line x1="255" y1="240" x2="292" y2="222" strokeWidth="0.6" />
        <line x1="292" y1="222" x2="340" y2="222" strokeWidth="0.6" />
        <text x="342" y="226" fontSize="7.5">⌀76</text>
        <line x1="150" y1="200" x2="175" y2="186" strokeWidth="0.6" />
        <line x1="175" y1="186" x2="222" y2="186" strokeWidth="0.6" />
        <text x="224" y="190" fontSize="7">⌀18 × 4</text>
      </g>
      <g>
        <rect x="597" y="185" width="176" height="117" fill="none" stroke="#1C1917" strokeWidth="1.2" />
        <rect x="597" y="245" width="46" height="57" fill="url(#h45c)" />
        <rect x="727" y="245" width="46" height="57" fill="url(#h45c)" />
        <rect x="643" y="245" width="84" height="57" fill="white" />
        <line x1="643" y1="245" x2="643" y2="302" stroke="#1C1917" strokeWidth="1.2" />
        <line x1="727" y1="245" x2="727" y2="302" stroke="#1C1917" strokeWidth="1.2" />
        <text x="685" y="318" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">SECTION A-A</text>
        <line x1="467" y1="250" x2="480" y2="250" stroke="#1C1917" strokeWidth="1" />
        <line x1="360" y1="250" x2="373" y2="250" stroke="#1C1917" strokeWidth="1" />
        <text x="461" y="248" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
        <text x="375" y="248" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
      </g>
      <g fill="none">
        <rect x="196" y="158" width="110" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
        <line x1="212" y1="158" x2="212" y2="172" stroke="#F47A20" strokeWidth="0.8" />
        <line x1="248" y1="158" x2="248" y2="172" stroke="#F47A20" strokeWidth="0.8" />
        <line x1="270" y1="158" x2="270" y2="172" stroke="#F47A20" strokeWidth="0.8" />
        <line x1="288" y1="158" x2="288" y2="172" stroke="#F47A20" strokeWidth="0.8" />
        <text x="204" y="168" fontSize="9" fill="#F47A20" textAnchor="middle">⌖</text>
        <text x="230" y="168" fontSize="6.5" fill="#F47A20" textAnchor="middle">⌀0.05</text>
        <text x="259" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
        <text x="279" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">B</text>
        <text x="297" y="168" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">C</text>
        <rect x="432" y="140" width="62" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
        <line x1="448" y1="140" x2="448" y2="154" stroke="#F47A20" strokeWidth="0.8" />
        <text x="440" y="150" fontSize="9" fill="#F47A20" textAnchor="middle">⏥</text>
        <text x="471" y="150" fontSize="6.5" fill="#F47A20" textAnchor="middle">0.02</text>
        <rect x="438" y="353" width="18" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
        <text x="447" y="363" fontSize="8" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
        <polygon points="447,367 442,375 452,375" fill="none" stroke="#F47A20" strokeWidth="0.8" />
      </g>
      <g>
        <rect x="660" y="14" width="146" height="58" fill="none" stroke="#1C1917" strokeWidth="0.6" />
        <line x1="660" y1="26" x2="806" y2="26" stroke="#1C1917" strokeWidth="0.4" />
        <line x1="660" y1="42" x2="806" y2="42" stroke="#1C1917" strokeWidth="0.35" />
        <line x1="678" y1="26" x2="678" y2="72" stroke="#1C1917" strokeWidth="0.35" />
        <line x1="714" y1="26" x2="714" y2="72" stroke="#1C1917" strokeWidth="0.35" />
        <text x="666" y="21" fontSize="6" fill="#78716C">REV</text>
        <text x="690" y="21" fontSize="6" fill="#78716C">DATE</text>
        <text x="730" y="21" fontSize="6" fill="#78716C">DESCRIPTION</text>
        <text x="668" y="37" fontSize="7" fill="#1C1917" fontWeight="600">A</text>
        <text x="681" y="37" fontSize="6" fill="#1C1917">11/06/26</text>
        <text x="717" y="37" fontSize="6" fill="#1C1917">Initial Release</text>
        <text x="733" y="14" fontSize="6.5" fill="#78716C" textAnchor="middle">REVISIONS</text>
      </g>
      <rect x="14" y="514" width="792" height="62" fill="white" stroke="#1C1917" strokeWidth="0.7" />
      <line x1="260" y1="514" x2="260" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <line x1="370" y1="514" x2="370" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <line x1="470" y1="514" x2="470" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <line x1="540" y1="514" x2="540" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <line x1="620" y1="514" x2="620" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <line x1="680" y1="514" x2="680" y2="576" stroke="#1C1917" strokeWidth="0.5" />
      <text x="20" y="525" fontSize="6" fill="#78716C">TITLE</text>
      <text x="20" y="561" fontSize="9.5" fill="#1C1917" fontWeight="600">Motor Housing Assembly</text>
      <text x="266" y="525" fontSize="6" fill="#78716C">DWG NO.</text>
      <text x="266" y="561" fontSize="8.5" fill="#1C1917">PRJ-904-MH-001</text>
      <text x="376" y="525" fontSize="6" fill="#78716C">SCALE</text>
      <text x="376" y="561" fontSize="9" fill="#1C1917">1 : 2</text>
      <text x="476" y="525" fontSize="6" fill="#78716C">SHEET</text>
      <text x="476" y="561" fontSize="9" fill="#1C1917">1 of 3</text>
      <text x="546" y="525" fontSize="6" fill="#78716C">DATE</text>
      <text x="546" y="561" fontSize="8" fill="#1C1917">11 Jun 2026</text>
      <text x="626" y="525" fontSize="6" fill="#78716C">REV</text>
      <text x="626" y="561" fontSize="10" fill="#1C1917" fontWeight="700">A</text>
      <text x="766" y="538" fontSize="12" fill="#F47A20" fontWeight="700" textAnchor="middle" letterSpacing="1.5">HANOMI</text>
      <text x="766" y="552" fontSize="6.5" fill="#78716C" textAnchor="middle">Manufacturing Drawings</text>
      <text x="766" y="563" fontSize="5.5" fill="#9E988F" textAnchor="middle">ASME Y14.5 · ISO 1101</text>
    </svg>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const STAGE_LABEL: Record<Stage, string> = {
  blueprint:  "Try Hanomi",
  model:      "Inspect Part",
  projection: "Projecting Views",
  thinking:   "AI Analysis",
  drawing:    "Generating Drawing",
  review:     "Hanomi Review",
  complete:   "Complete",
}

export function TryHanomi({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("blueprint")
  const [partId, setPartId] = useState<string>("motor")

  const go = useCallback((s: Stage) => setStage(s), [])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[50px] border-b border-border bg-card flex items-center px-5 gap-4 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/hanomi_logo.png" alt="Hanomi" className="h-5 w-auto object-contain" />
          <div className="w-px h-4 bg-border" />
          <span className="text-xs text-muted-foreground">{STAGE_LABEL[stage]}</span>
        </div>

        {/* Stage dots */}
        <div className="flex items-center gap-1.5 mx-auto">
          {(["blueprint","model","projection","thinking","drawing","review","complete"] as Stage[]).map((s, i) => {
            const stages: Stage[] = ["blueprint","model","projection","thinking","drawing","review","complete"]
            const ci = stages.indexOf(stage)
            const si = stages.indexOf(s)
            return (
              <div key={s} className={cn(
                "rounded-full transition-all duration-300",
                si < ci  ? "w-1.5 h-1.5 bg-primary" :
                si === ci ? "w-4 h-1.5 bg-primary" :
                "w-1.5 h-1.5 bg-border"
              )} />
            )
          })}
        </div>

        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Stage content */}
      <main className="flex-1 overflow-hidden" key={stage}>
        {stage === "blueprint"  && <BlueprintStage  onSelect={id => { setPartId(id); go("model") }} />}
        {stage === "model"      && <ModelStage      partId={partId} onGenerate={() => go("projection")} />}
        {stage === "projection" && <ProjectionStage onDone={() => go("thinking")} />}
        {stage === "thinking"   && <ThinkingStage   onDone={() => go("drawing")} />}
        {stage === "drawing"    && <DrawingStage    onDone={() => go("review")} />}
        {stage === "review"     && <ReviewStage     onDone={() => go("complete")} />}
        {stage === "complete"   && <CompleteStage   onClose={onClose} />}
      </main>
    </div>
  )
}
