"use client"

import { useState, useEffect, useCallback } from "react"
import {
  X, Upload, FileText, Check, ArrowRight, Download, Share2,
  RotateCcw, Clock, Folder, RefreshCw, AlertTriangle, Printer,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkflowStep = "upload" | "analysis" | "generate" | "review" | "export"

const STEPS: { id: WorkflowStep; label: string }[] = [
  { id: "upload",   label: "Upload"   },
  { id: "analysis", label: "Analyze"  },
  { id: "generate", label: "Generate" },
  { id: "review",   label: "Review"   },
  { id: "export",   label: "Export"   },
]

// ─── Dimension inspector data ─────────────────────────────────────────────────

interface DimData {
  id: string
  displayValue: string
  unit: string
  label: string
  reasoning: string[]
  confidence: number
}

const DIMENSIONS: DimData[] = [
  {
    id: "overall-width",
    displayValue: "240", unit: "mm", label: "Overall Width",
    reasoning: [
      "Outer body profile extracted from STEP topology",
      "Shared fit interface with mating housing component",
      "Manufacturing critical — defines raw material blank size",
    ],
    confidence: 99.4,
  },
  {
    id: "body-height",
    displayValue: "155", unit: "mm", label: "Body Height",
    reasoning: [
      "Vertical envelope of main body feature",
      "Clearance to adjacent assembly components verified",
      "ASME Y14.5 size dimension per §2.4",
    ],
    confidence: 98.1,
  },
  {
    id: "bore-dia",
    displayValue: "Ø76", unit: "mm", label: "Central Bore Diameter",
    reasoning: [
      "Cylindrical through-bore detected in STEP topology",
      "Shaft fit interface — shared with rotating assembly",
      "Manufacturing critical — H7 tolerance class implied",
    ],
    confidence: 99.7,
  },
  {
    id: "hole-dia",
    displayValue: "Ø18 × 4", unit: "mm", label: "Mounting Hole Pattern",
    reasoning: [
      "Circular pattern of 4 holes at ⌀196 bolt circle",
      "M16 clearance fit fastener group detected",
      "Position tolerance recommended per ASME Y14.5 §7.2",
    ],
    confidence: 97.8,
  },
  {
    id: "flange-width",
    displayValue: "280", unit: "mm", label: "Flange Width",
    reasoning: [
      "Flange base profile — primary mating face",
      "Sealing interface detected — critical dimension",
      "Datum A reference surface for tolerance stack",
    ],
    confidence: 98.9,
  },
]

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: WorkflowStep }) {
  const ci = STEPS.findIndex(s => s.id === currentStep)
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200",
            i < ci  ? "text-primary" :
            i === ci ? "bg-primary/10 text-primary font-semibold border border-primary/20" :
            "text-muted-foreground"
          )}>
            <span className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-200",
              i < ci  ? "bg-primary text-white" :
              i === ci ? "bg-primary/15 text-primary" :
              "bg-muted text-muted-foreground"
            )}>
              {i < ci ? <Check className="w-2.5 h-2.5" strokeWidth={2.5} /> : i + 1}
            </span>
            <span className="hidden sm:block">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("w-6 h-px mx-0.5 transition-all duration-300", i < ci ? "bg-primary/40" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Engineering Drawing SVG ──────────────────────────────────────────────────

interface DrawingVis {
  frontView: boolean; topView: boolean; sideView: boolean
  hiddenLines: boolean; centerLines: boolean; dimensions: boolean
  sectionMarks: boolean; gdt: boolean; titleBlock: boolean
}

interface DrawingProps {
  vis: DrawingVis
  onDimClick?: (id: string) => void
  activeDim?: string | null
}

function EngineeringDrawing({ vis, onDimClick, activeDim }: DrawingProps) {
  const clickable = !!onDimClick
  const dimProps = (id: string) => clickable
    ? { onClick: () => onDimClick(id), style: { cursor: "pointer" as const } }
    : {}

  return (
    <svg viewBox="0 0 820 580" className="w-full h-full" style={{ fontFamily: "var(--font-mono, monospace)" }}>
      <defs>
        <pattern id="hatch45" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45 0 0)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#1C1917" strokeWidth="0.55" opacity="0.4" />
        </pattern>
      </defs>

      {/* Sheet borders */}
      <rect x="2" y="2" width="816" height="576" fill="white" stroke="#1C1917" strokeWidth="1.5" />
      <rect x="14" y="14" width="792" height="552" fill="none" stroke="#1C1917" strokeWidth="0.5" />

      {/* ── Front View ── */}
      {vis.frontView && (
        <g>
          <rect x="120" y="185" width="240" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <rect x="100" y="340" width="280" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="100" y1="340" x2="120" y2="340" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="360" y1="340" x2="380" y2="340" stroke="#1C1917" strokeWidth="1.2" />
          <circle cx="240" cy="262" r="38" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <circle cx="142" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="338" cy="205" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="142" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="338" cy="320" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <text x="240" y="378" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
        </g>
      )}

      {vis.hiddenLines && vis.frontView && (
        <g stroke="#1C1917" strokeWidth="0.65" strokeDasharray="5,3" opacity="0.55">
          <rect x="152" y="208" width="176" height="108" fill="none" />
          <circle cx="240" cy="262" r="26" fill="none" />
        </g>
      )}

      {vis.centerLines && vis.frontView && (
        <g stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4">
          <line x1="108" y1="262" x2="380" y2="262" />
          <line x1="240" y1="172" x2="240" y2="385" />
          <line x1="130" y1="205" x2="154" y2="205" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="142" y1="193" x2="142" y2="217" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="326" y1="205" x2="350" y2="205" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="338" y1="193" x2="338" y2="217" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="130" y1="320" x2="154" y2="320" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="142" y1="308" x2="142" y2="332" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="326" y1="320" x2="350" y2="320" strokeDasharray="none" strokeWidth="0.4" />
          <line x1="338" y1="308" x2="338" y2="332" strokeDasharray="none" strokeWidth="0.4" />
        </g>
      )}

      {vis.sectionMarks && vis.frontView && (
        <g>
          <line x1="108" y1="250" x2="120" y2="250" stroke="#1C1917" strokeWidth="1" />
          <line x1="360" y1="250" x2="372" y2="250" stroke="#1C1917" strokeWidth="1" />
          <text x="100" y="247" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
          <text x="375" y="247" fontSize="7.5" fill="#1C1917" fontWeight="bold">A</text>
          <polygon points="112,250 106,246 106,254" fill="#1C1917" />
          <polygon points="366,250 372,246 372,254" fill="#1C1917" />
        </g>
      )}

      {/* ── Top View ── */}
      {vis.topView && (
        <g>
          <rect x="120" y="55" width="240" height="100" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <circle cx="240" cy="105" r="38" fill="none" stroke="#1C1917" strokeWidth="0.7" strokeDasharray="5,3" />
          <rect x="152" y="75" width="176" height="60" fill="none" stroke="#1C1917" strokeWidth="0.55" strokeDasharray="5,3" />
          <circle cx="142" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="338" cy="67" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="142" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          <circle cx="338" cy="143" r="9" fill="none" stroke="#1C1917" strokeWidth="1.1" />
          {vis.centerLines && (
            <g stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4">
              <line x1="108" y1="105" x2="380" y2="105" />
              <line x1="240" y1="43" x2="240" y2="167" />
            </g>
          )}
          <text x="240" y="22" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
          <line x1="200" y1="26" x2="280" y2="26" stroke="#1C1917" strokeWidth="0.4" />
        </g>
      )}

      {/* ── Right Side View ── */}
      {vis.sideView && (
        <g>
          <rect x="425" y="185" width="125" height="155" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <rect x="410" y="340" width="155" height="22" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="410" y1="340" x2="425" y2="340" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="550" y1="340" x2="565" y2="340" stroke="#1C1917" strokeWidth="1.2" />
          <rect x="442" y="208" width="91" height="108" fill="none" stroke="#1C1917" strokeWidth="0.6" strokeDasharray="5,3" opacity="0.6" />
          {vis.hiddenLines && (
            <g stroke="#1C1917" strokeWidth="0.7" strokeDasharray="5,3" opacity="0.55">
              <line x1="449" y1="224" x2="449" y2="300" />
              <line x1="531" y1="224" x2="531" y2="300" />
            </g>
          )}
          {vis.centerLines && (
            <line x1="487" y1="165" x2="487" y2="375" stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4" />
          )}
          <text x="487" y="378" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">RIGHT VIEW</text>
        </g>
      )}

      {/* ── Section View A-A ── */}
      {vis.sectionMarks && (
        <g>
          <rect x="597" y="185" width="46" height="177" fill="url(#hatch45)" />
          <rect x="727" y="185" width="46" height="177" fill="url(#hatch45)" />
          <rect x="643" y="185" width="84" height="177" fill="white" />
          <rect x="597" y="185" width="176" height="177" fill="none" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="643" y1="185" x2="643" y2="362" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="727" y1="185" x2="727" y2="362" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="639" y1="185" x2="649" y2="195" stroke="#1C1917" strokeWidth="1.1" />
          <line x1="723" y1="185" x2="733" y2="195" stroke="#1C1917" strokeWidth="1.1" />
          {vis.centerLines && (
            <line x1="685" y1="165" x2="685" y2="380" stroke="#F47A20" strokeWidth="0.55" opacity="0.75" strokeDasharray="10,4,2,4" />
          )}
          <circle cx="643" cy="200" r="12" fill="none" stroke="#1C1917" strokeWidth="0.8" />
          <text x="643" y="204" fontSize="7" fill="#1C1917" textAnchor="middle" fontWeight="bold">B</text>
          <text x="685" y="379" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="1">SECTION A-A</text>
          <line x1="640" y1="383" x2="730" y2="383" stroke="#1C1917" strokeWidth="0.4" />
        </g>
      )}

      {/* ── Detail View B ── */}
      {vis.sectionMarks && (
        <g>
          <rect x="597" y="25" width="100" height="100" fill="none" stroke="#1C1917" strokeWidth="0.8" />
          <rect x="617" y="25" width="30" height="100" fill="url(#hatch45)" />
          <rect x="667" y="25" width="30" height="100" fill="url(#hatch45)" />
          <rect x="647" y="25" width="20" height="100" fill="white" />
          <line x1="647" y1="25" x2="647" y2="125" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="667" y1="25" x2="667" y2="125" stroke="#1C1917" strokeWidth="1.2" />
          <line x1="643" y1="25" x2="651" y2="33" stroke="#1C1917" strokeWidth="1.1" />
          <line x1="663" y1="25" x2="671" y2="33" stroke="#1C1917" strokeWidth="1.1" />
          {vis.dimensions && (
            <g fill="#F47A20" stroke="#F47A20" strokeWidth="0.5">
              <line x1="631" y1="27" x2="646" y2="42" />
              <text x="620" y="38" fontSize="6.5" fill="#F47A20">C2</text>
            </g>
          )}
          <text x="647" y="18" fontSize="7" fill="#1C1917" textAnchor="middle" letterSpacing="0.5">DETAIL B</text>
          <text x="647" y="10" fontSize="6" fill="#78716C" textAnchor="middle">SCALE 5:1</text>
        </g>
      )}

      {/* ── Dimensions (with optional click zones) ── */}
      {vis.dimensions && (
        <g fill="#F47A20" stroke="#F47A20">

          {/* Overall width — clickable */}
          <g {...dimProps("overall-width")}>
            {activeDim === "overall-width" && <rect x="107" y="388" width="265" height="30" rx="3" fill="#F47A20" fillOpacity="0.1" stroke="none" />}
            <line x1="120" y1="398" x2="360" y2="398" strokeWidth="0.6" />
            <line x1="120" y1="392" x2="120" y2="404" strokeWidth="0.6" />
            <line x1="360" y1="392" x2="360" y2="404" strokeWidth="0.6" />
            <polygon points="120,398 126,396 126,400" />
            <polygon points="360,398 354,396 354,400" />
            <text x="240" y="412" textAnchor="middle" fontSize="7.5" fontWeight={activeDim === "overall-width" ? "700" : "400"}>240</text>
            {clickable && <rect x="107" y="388" width="265" height="30" fill="transparent" />}
          </g>

          {/* Flange width — clickable */}
          <g {...dimProps("flange-width")}>
            {activeDim === "flange-width" && <rect x="87" y="410" width="305" height="30" rx="3" fill="#F47A20" fillOpacity="0.1" stroke="none" />}
            <line x1="100" y1="420" x2="380" y2="420" strokeWidth="0.6" />
            <line x1="100" y1="414" x2="100" y2="426" strokeWidth="0.6" />
            <line x1="380" y1="414" x2="380" y2="426" strokeWidth="0.6" />
            <polygon points="100,420 106,418 106,422" />
            <polygon points="380,420 374,418 374,422" />
            <text x="240" y="434" textAnchor="middle" fontSize="7.5" fontWeight={activeDim === "flange-width" ? "700" : "400"}>280</text>
            {clickable && <rect x="87" y="410" width="305" height="30" fill="transparent" />}
          </g>

          {/* Body height — clickable */}
          <g {...dimProps("body-height")}>
            {activeDim === "body-height" && <rect x="54" y="175" width="44" height="170" rx="3" fill="#F47A20" fillOpacity="0.1" stroke="none" />}
            <line x1="78" y1="185" x2="78" y2="340" strokeWidth="0.6" />
            <line x1="72" y1="185" x2="84" y2="185" strokeWidth="0.6" />
            <line x1="72" y1="340" x2="84" y2="340" strokeWidth="0.6" />
            <polygon points="78,185 76,191 80,191" />
            <polygon points="78,340 76,334 80,334" />
            <text x="68" y="266" textAnchor="middle" fontSize="7.5" transform="rotate(-90,68,266)" fontWeight={activeDim === "body-height" ? "700" : "400"}>155</text>
            {clickable && <rect x="54" y="175" width="44" height="170" fill="transparent" />}
          </g>

          {/* Flange height */}
          <g>
            <line x1="58" y1="340" x2="58" y2="362" strokeWidth="0.6" />
            <line x1="52" y1="340" x2="64" y2="340" strokeWidth="0.6" />
            <line x1="52" y1="362" x2="64" y2="362" strokeWidth="0.6" />
            <text x="47" y="354" textAnchor="middle" fontSize="7" transform="rotate(-90,47,354)">22</text>
          </g>

          {/* Bore diameter leader — clickable */}
          <g {...dimProps("bore-dia")}>
            {activeDim === "bore-dia" && <rect x="252" y="210" width="110" height="25" rx="3" fill="#F47A20" fillOpacity="0.1" stroke="none" />}
            <line x1="255" y1="240" x2="292" y2="222" strokeWidth="0.6" />
            <line x1="292" y1="222" x2="340" y2="222" strokeWidth="0.6" />
            <text x="342" y="226" fontSize="7.5" fontWeight={activeDim === "bore-dia" ? "700" : "400"}>⌀76</text>
            {clickable && <rect x="252" y="210" width="110" height="25" fill="transparent" />}
          </g>

          {/* Hole diameter leader — clickable */}
          <g {...dimProps("hole-dia")}>
            {activeDim === "hole-dia" && <rect x="147" y="176" width="115" height="22" rx="3" fill="#F47A20" fillOpacity="0.1" stroke="none" />}
            <line x1="150" y1="200" x2="175" y2="186" strokeWidth="0.6" />
            <line x1="175" y1="186" x2="222" y2="186" strokeWidth="0.6" />
            <text x="224" y="190" fontSize="7" fontWeight={activeDim === "hole-dia" ? "700" : "400"}>⌀18 × 4</text>
            {clickable && <rect x="147" y="176" width="115" height="22" fill="transparent" />}
          </g>

          {/* Bolt circle BC */}
          <g>
            <line x1="142" y1="438" x2="338" y2="438" strokeWidth="0.6" />
            <line x1="142" y1="432" x2="142" y2="444" strokeWidth="0.6" />
            <line x1="338" y1="432" x2="338" y2="444" strokeWidth="0.6" />
            <text x="240" y="450" textAnchor="middle" fontSize="7">196 B.C.</text>
          </g>

          {/* Top view depth */}
          <g>
            <line x1="407" y1="55" x2="407" y2="155" strokeWidth="0.6" />
            <line x1="401" y1="55" x2="413" y2="55" strokeWidth="0.6" />
            <line x1="401" y1="155" x2="413" y2="155" strokeWidth="0.6" />
            <text x="418" y="109" fontSize="7.5">100</text>
          </g>

          {/* Section bore width */}
          <g>
            <line x1="643" y1="400" x2="727" y2="400" strokeWidth="0.6" />
            <line x1="643" y1="394" x2="643" y2="406" strokeWidth="0.6" />
            <line x1="727" y1="394" x2="727" y2="406" strokeWidth="0.6" />
            <text x="685" y="414" textAnchor="middle" fontSize="7">⌀84 BORE</text>
          </g>

          {/* Wall thickness */}
          <g>
            <line x1="575" y1="185" x2="575" y2="362" strokeWidth="0.6" />
            <line x1="569" y1="185" x2="581" y2="185" strokeWidth="0.6" />
            <line x1="569" y1="362" x2="581" y2="362" strokeWidth="0.6" />
            <text x="562" y="278" fontSize="7" textAnchor="middle" transform="rotate(-90,562,278)">177</text>
          </g>

          {/* R note */}
          <g>
            <line x1="156" y1="212" x2="138" y2="198" strokeWidth="0.6" />
            <text x="118" y="196" fontSize="6.5">R3 TYP</text>
          </g>
        </g>
      )}

      {/* ── GD&T Annotations ── */}
      {vis.gdt && (
        <g>
          <g transform="translate(196,158)">
            <rect x="0" y="0" width="110" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="16" y1="0" x2="16" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="52" y1="0" x2="52" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="74" y1="0" x2="74" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="92" y1="0" x2="92" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <text x="8" y="10" fontSize="9" fill="#F47A20" textAnchor="middle">⌖</text>
            <text x="34" y="10" fontSize="6.5" fill="#F47A20" textAnchor="middle">⌀0.05</text>
            <text x="63" y="10" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
            <text x="83" y="10" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">B</text>
            <text x="101" y="10" fontSize="7" fill="#F47A20" textAnchor="middle" fontWeight="bold">C</text>
            <line x1="55" y1="14" x2="55" y2="26" stroke="#F47A20" strokeWidth="0.6" />
            <line x1="55" y1="26" x2="240" y2="26" stroke="#F47A20" strokeWidth="0.6" />
            <line x1="240" y1="26" x2="240" y2="186" stroke="#F47A20" strokeWidth="0.6" />
            <polygon points="240,186 237,180 243,180" fill="#F47A20" />
          </g>
          <g transform="translate(432,140)">
            <rect x="0" y="0" width="62" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="16" y1="0" x2="16" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <text x="8" y="10" fontSize="9" fill="#F47A20" textAnchor="middle">⏥</text>
            <text x="39" y="10" fontSize="6.5" fill="#F47A20" textAnchor="middle">0.02</text>
            <line x1="0" y1="7" x2="-15" y2="7" stroke="#F47A20" strokeWidth="0.6" />
            <line x1="-15" y1="7" x2="-15" y2="52" stroke="#F47A20" strokeWidth="0.6" />
            <polygon points="-15,199 -18,193 -12,193" fill="#F47A20" />
          </g>
          <g transform="translate(440,355)">
            <rect x="0" y="0" width="18" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <text x="9" y="10" fontSize="8" fill="#F47A20" textAnchor="middle" fontWeight="bold">A</text>
            <polygon points="9,14 4,22 14,22" fill="none" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="9" y1="22" x2="9" y2="28" stroke="#F47A20" strokeWidth="0.6" />
          </g>
          <g transform="translate(88,256)">
            <rect x="0" y="0" width="18" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <text x="9" y="10" fontSize="8" fill="#F47A20" textAnchor="middle" fontWeight="bold">B</text>
            <polygon points="18,7 26,3 26,11" fill="none" stroke="#F47A20" strokeWidth="0.8" />
          </g>
          <g transform="translate(290,256)">
            <rect x="0" y="0" width="64" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="16" y1="0" x2="16" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <text x="8" y="10.5" fontSize="9" fill="#F47A20" textAnchor="middle">○</text>
            <text x="40" y="10" fontSize="6.5" fill="#F47A20" textAnchor="middle">0.015</text>
            <circle cx="8" cy="20" r="1.5" fill="#F47A20" />
          </g>
          <g transform="translate(356,175)">
            <path d="M 0 10 L 8 10 L 4 3 Z" fill="none" stroke="#F47A20" strokeWidth="0.7" />
            <line x1="8" y1="10" x2="22" y2="10" stroke="#F47A20" strokeWidth="0.6" />
            <text x="24" y="14" fontSize="6.5" fill="#F47A20">Ra 1.6</text>
          </g>
          <g transform="translate(558,257)">
            <rect x="0" y="0" width="62" height="14" fill="white" stroke="#F47A20" strokeWidth="0.8" />
            <line x1="16" y1="0" x2="16" y2="14" stroke="#F47A20" strokeWidth="0.8" />
            <text x="8" y="10" fontSize="9" fill="#F47A20" textAnchor="middle">⊥</text>
            <text x="39" y="10" fontSize="6.5" fill="#F47A20" textAnchor="middle">0.03 A</text>
          </g>
        </g>
      )}

      {/* ── Title Block ── */}
      {vis.titleBlock && (
        <g>
          <rect x="14" y="514" width="792" height="60" fill="white" stroke="#1C1917" strokeWidth="0.7" />
          <line x1="260" y1="514" x2="260" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="370" y1="514" x2="370" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="470" y1="514" x2="470" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="540" y1="514" x2="540" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="620" y1="514" x2="620" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="680" y1="514" x2="680" y2="574" stroke="#1C1917" strokeWidth="0.45" />
          <line x1="14" y1="538" x2="260" y2="538" stroke="#1C1917" strokeWidth="0.35" />
          <line x1="370" y1="538" x2="680" y2="538" stroke="#1C1917" strokeWidth="0.35" />
          <text x="20" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">TITLE</text>
          <text x="20" y="559" fontSize="9.5" fill="#1C1917" fontWeight="600">Motor Housing Assembly</text>
          <text x="266" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">DWG NO.</text>
          <text x="266" y="559" fontSize="8.5" fill="#1C1917">PRJ-904-MH-001</text>
          <text x="376" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">MATERIAL</text>
          <text x="376" y="555" fontSize="8" fill="#1C1917">Aluminium 6061-T6</text>
          <text x="376" y="542" fontSize="6" fill="#78716C" letterSpacing="0.5">FINISH</text>
          <text x="432" y="555" fontSize="8" fill="#1C1917">Hard Anodized</text>
          <text x="476" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">SCALE</text>
          <text x="476" y="559" fontSize="9" fill="#1C1917">1 : 2</text>
          <text x="476" y="542" fontSize="6" fill="#78716C" letterSpacing="0.5">SHEET</text>
          <text x="476" y="569" fontSize="8" fill="#1C1917">1 of 3</text>
          <text x="546" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">DATE</text>
          <text x="546" y="555" fontSize="8" fill="#1C1917">10 Jun 2026</text>
          <text x="546" y="542" fontSize="6" fill="#78716C" letterSpacing="0.5">APPROVED</text>
          <text x="546" y="569" fontSize="8" fill="#1C1917">A. Mercer</text>
          <text x="626" y="525" fontSize="6" fill="#78716C" letterSpacing="0.5">REV</text>
          <text x="626" y="558" fontSize="10" fill="#1C1917" fontWeight="700">A</text>
          <text x="766" y="536" fontSize="11" fill="#F47A20" fontWeight="700" textAnchor="middle" letterSpacing="1.5">HANOMI</text>
          <text x="766" y="549" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.3">Manufacturing Drawings</text>
          <text x="766" y="561" fontSize="5.5" fill="#9E988F" textAnchor="middle">ASME Y14.5 · ISO 1101</text>
          <text x="20" y="505" fontSize="5.5" fill="#9E988F">TOLERANCES UNLESS NOTED: LINEAR ±0.1 · ANGULAR ±0.5°</text>
          <text x="20" y="496" fontSize="5.5" fill="#9E988F">1. REMOVE ALL BURRS AND SHARP EDGES  2. MATERIAL FREE OF DEFECTS</text>
        </g>
      )}

      {/* ── Revision Table ── */}
      {vis.titleBlock && (
        <g>
          <rect x="660" y="14" width="146" height="78" fill="none" stroke="#1C1917" strokeWidth="0.6" />
          <line x1="660" y1="26" x2="806" y2="26" stroke="#1C1917" strokeWidth="0.4" />
          <line x1="660" y1="42" x2="806" y2="42" stroke="#1C1917" strokeWidth="0.35" />
          <line x1="660" y1="58" x2="806" y2="58" stroke="#1C1917" strokeWidth="0.35" />
          <line x1="660" y1="74" x2="806" y2="74" stroke="#1C1917" strokeWidth="0.35" />
          <line x1="678" y1="26" x2="678" y2="92" stroke="#1C1917" strokeWidth="0.35" />
          <line x1="714" y1="26" x2="714" y2="92" stroke="#1C1917" strokeWidth="0.35" />
          <text x="666" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">REV</text>
          <text x="690" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">DATE</text>
          <text x="730" y="21" fontSize="6" fill="#78716C" letterSpacing="0.3">DESCRIPTION</text>
          <text x="668" y="37" fontSize="7" fill="#1C1917" fontWeight="600">A</text>
          <text x="681" y="37" fontSize="6" fill="#1C1917">10/06/26</text>
          <text x="717" y="37" fontSize="6" fill="#1C1917">Initial Release</text>
          <text x="668" y="53" fontSize="7" fill="#C4BDB5">—</text>
          <text x="668" y="69" fontSize="7" fill="#C4BDB5">—</text>
          <text x="733" y="14" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.5">REVISIONS</text>
        </g>
      )}

      {vis.titleBlock && (
        <text x="420" y="505" fontSize="6.5" fill="#78716C" textAnchor="middle" letterSpacing="0.5">THIRD ANGLE PROJECTION</text>
      )}
    </svg>
  )
}

// ─── Isometric CAD Preview ────────────────────────────────────────────────────

function IsometricCAD({ filename = "motor_housing_v12.step" }: { filename?: string }) {
  return (
    <svg viewBox="0 0 340 300" className="w-full h-full" style={{ fontFamily: "var(--font-mono, monospace)" }}>
      <pattern id="dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#D4CEC8" />
      </pattern>
      <rect width="340" height="300" fill="url(#dots)" />
      <ellipse cx="195" cy="278" rx="95" ry="8" fill="#D4CEC8" opacity="0.5" />
      <polygon points="260,110 300,85 300,195 260,220" fill="#C8C2BA" stroke="#8C8680" strokeWidth="0.9" />
      <polygon points="100,110 260,110 260,220 100,220" fill="#D8D3CC" stroke="#8C8680" strokeWidth="0.9" />
      <polygon points="100,110 260,110 300,85 140,85" fill="#E8E4DE" stroke="#8C8680" strokeWidth="0.9" />
      <polygon points="88,220 272,220 272,238 88,238" fill="#CEC9C1" stroke="#8C8680" strokeWidth="0.9" />
      <polygon points="272,220 312,195 312,213 272,238" fill="#BDB8B0" stroke="#8C8680" strokeWidth="0.9" />
      <polygon points="88,220 100,220 140,195 128,195" fill="#D8D3CC" stroke="#8C8680" strokeWidth="0.5" strokeDasharray="2,1" />
      <polygon points="260,220 272,220 312,195 300,195" fill="#D8D3CC" stroke="#8C8680" strokeWidth="0.5" strokeDasharray="2,1" />
      <ellipse cx="180" cy="165" rx="36" ry="36" fill="#4A4540" stroke="#8C8680" strokeWidth="1" />
      <ellipse cx="180" cy="165" rx="28" ry="28" fill="#3A3530" stroke="#6B635C" strokeWidth="0.7" />
      <ellipse cx="180" cy="165" rx="20" ry="20" fill="#2A2520" />
      <ellipse cx="118" cy="130" rx="7" ry="7" fill="#5A5550" stroke="#8C8680" strokeWidth="0.7" />
      <ellipse cx="242" cy="130" rx="7" ry="7" fill="#5A5550" stroke="#8C8680" strokeWidth="0.7" />
      <ellipse cx="118" cy="200" rx="7" ry="7" fill="#5A5550" stroke="#8C8680" strokeWidth="0.7" />
      <ellipse cx="242" cy="200" rx="7" ry="7" fill="#5A5550" stroke="#8C8680" strokeWidth="0.7" />
      <ellipse cx="200" cy="100" rx="36" ry="14" fill="#4A4540" stroke="#6B635C" strokeWidth="0.8" />
      <ellipse cx="200" cy="100" rx="26" ry="10" fill="#3A3530" />
      <ellipse cx="148" cy="93" rx="7" ry="3" fill="#5A5550" stroke="#6B635C" strokeWidth="0.5" />
      <ellipse cx="254" cy="93" rx="7" ry="3" fill="#5A5550" stroke="#6B635C" strokeWidth="0.5" />
      <line x1="100" y1="110" x2="260" y2="110" stroke="#F0EDE8" strokeWidth="0.8" opacity="0.7" />
      <line x1="100" y1="110" x2="140" y2="85" stroke="#F0EDE8" strokeWidth="0.6" opacity="0.5" />
      <ellipse cx="300" cy="150" rx="14" ry="36" fill="none" stroke="#8C8680" strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
      <line x1="100" y1="245" x2="260" y2="245" stroke="#F47A20" strokeWidth="0.7" />
      <line x1="100" y1="241" x2="100" y2="249" stroke="#F47A20" strokeWidth="0.7" />
      <line x1="260" y1="241" x2="260" y2="249" stroke="#F47A20" strokeWidth="0.7" />
      <text x="180" y="255" textAnchor="middle" fontSize="7.5" fill="#F47A20">240 mm</text>
      <text x="10" y="20" fontSize="8" fill="#78716C">{filename}</text>
      <text x="10" y="32" fontSize="7" fill="#9E988F">Parts: 18 · Features: 146</text>
      <g transform="translate(22,255)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#F47A20" strokeWidth="0.9" />
        <line x1="0" y1="0" x2="0" y2="-20" stroke="#3B8C3B" strokeWidth="0.9" />
        <line x1="0" y1="0" x2="-12" y2="8" stroke="#3B7CB8" strokeWidth="0.9" />
        <text x="22" y="4" fontSize="6" fill="#F47A20">X</text>
        <text x="2" y="-22" fontSize="6" fill="#3B8C3B">Z</text>
        <text x="-22" y="16" fontSize="6" fill="#3B7CB8">Y</text>
      </g>
    </svg>
  )
}

// ─── Wireframe background ─────────────────────────────────────────────────────

function WireframeBg() {
  return (
    <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 36} x2="600" y2={i * 36} stroke="#1C1917" strokeWidth="0.8" />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2="400" stroke="#1C1917" strokeWidth="0.8" />
      ))}
      <rect x="200" y="80" width="200" height="160" fill="none" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="200" y1="80" x2="260" y2="40" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="400" y1="80" x2="460" y2="40" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="400" y1="240" x2="460" y2="200" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="260" y1="40" x2="460" y2="40" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="460" y1="40" x2="460" y2="200" stroke="#1C1917" strokeWidth="1.5" />
      <circle cx="300" cy="160" r="60" fill="none" stroke="#1C1917" strokeWidth="1.2" />
      <circle cx="300" cy="160" r="25" fill="none" stroke="#1C1917" strokeWidth="0.8" />
    </svg>
  )
}

// ─── Step 1: Upload ───────────────────────────────────────────────────────────

const DEMO_PARTS = [
  {
    id: "motor", file: "motor_housing_v12.step", label: "Motor Housing",
    meta: "STEP · 142.3 MB",
    icon: (
      <svg viewBox="0 0 60 40" fill="none" className="w-full h-full">
        <rect x="4" y="6" width="52" height="28" stroke="#D4CEC8" strokeWidth="0.9" rx="0.5" />
        <circle cx="30" cy="20" r="9" stroke="#D4CEC8" strokeWidth="0.8" />
        <circle cx="30" cy="20" r="4" stroke="#D4CEC8" strokeWidth="0.5" strokeDasharray="2,1" />
        <circle cx="10" cy="12" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="50" cy="12" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="10" cy="28" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="50" cy="28" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <line x1="30" y1="2" x2="30" y2="38" stroke="#F47A20" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
        <line x1="2" y1="20" x2="58" y2="20" stroke="#F47A20" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "valve", file: "valve_body_cast_v3.step", label: "Valve Body",
    meta: "STEP · 86.1 MB",
    icon: (
      <svg viewBox="0 0 60 40" fill="none" className="w-full h-full">
        <circle cx="30" cy="20" r="14" stroke="#D4CEC8" strokeWidth="0.8" />
        <circle cx="30" cy="20" r="6" stroke="#D4CEC8" strokeWidth="0.7" />
        <rect x="26" y="2" width="8" height="10" stroke="#D4CEC8" strokeWidth="0.7" rx="0.5" />
        <rect x="26" y="28" width="8" height="10" stroke="#D4CEC8" strokeWidth="0.7" rx="0.5" />
        <circle cx="10" cy="20" r="3" stroke="#D4CEC8" strokeWidth="0.5" />
        <circle cx="50" cy="20" r="3" stroke="#D4CEC8" strokeWidth="0.5" />
        <line x1="30" y1="2" x2="30" y2="38" stroke="#F47A20" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
        <line x1="2" y1="20" x2="58" y2="20" stroke="#F47A20" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "bracket", file: "turbine_bracket_asm_v2.step", label: "Turbine Bracket",
    meta: "STEP · 34.8 MB",
    icon: (
      <svg viewBox="0 0 60 40" fill="none" className="w-full h-full">
        <polyline points="8,8 8,32 52,32" stroke="#D4CEC8" strokeWidth="0.9" />
        <polyline points="8,8 22,8 22,32" stroke="#D4CEC8" strokeWidth="0.9" />
        <circle cx="15" cy="14" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="15" cy="24" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="32" cy="27" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <circle cx="44" cy="27" r="2.5" stroke="#D4CEC8" strokeWidth="0.6" />
        <line x1="15" y1="2" x2="15" y2="36" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="3,2" opacity="0.4" />
        <line x1="2" y1="32" x2="58" y2="32" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="3,2" opacity="0.4" />
      </svg>
    ),
  },
]

const recentFiles = [
  { name: "Clutch_Hub_Assembly.step",    size: "24.6 MB", opened: "12 min ago" },
  { name: "Valve_Housing_Cast.step",     size: "82.4 MB", opened: "1 hr ago"   },
  { name: "Bracket_Flange_Support.igs",  size: "18.1 MB", opened: "3 hrs ago"  },
]

function UploadStep({ onNext }: { onNext: () => void }) {
  const [state, setState]   = useState<"idle" | "loading" | "loaded">("idle")
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName]     = useState("")

  const load = (file: string) => {
    setFileName(file); setState("loading")
    setTimeout(() => setState("loaded"), 900)
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col gap-6 animate-fade-in py-4">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Upload CAD Model</h1>
          <p className="text-sm text-muted-foreground mt-1">Drop your 3D model to generate a manufacturing-ready drawing</p>
        </div>

        {/* Drop zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden",
            isDragging         ? "border-primary bg-accent/60" :
            state === "loaded" ? "border-emerald-300 bg-emerald-50/50" :
            "border-border hover:border-primary/30 hover:bg-accent/15 cursor-pointer"
          )}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) load(f.name) }}
        >
          {state !== "loaded" && (
            <input type="file" accept=".step,.stp,.igs,.iges,.sldprt" onChange={e => { const f = e.target.files?.[0]; if (f) load(f.name) }} className="absolute inset-0 opacity-0 cursor-pointer" />
          )}
          <div className="p-8 flex flex-col items-center gap-4">
            {state === "idle" && (
              <>
                <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center", isDragging ? "bg-primary/10 border-primary/30" : "bg-muted border-border")}>
                  <Upload className={cn("w-5 h-5", isDragging ? "text-primary" : "text-muted-foreground")} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop STEP / STP / IGES / SLDPRT</p>
                  <p className="text-xs text-muted-foreground mt-0.5">or click to browse files</p>
                </div>
              </>
            )}
            {state === "loading" && (
              <>
                <div className="w-12 h-12 rounded-xl border border-primary/20 bg-accent flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-border border-t-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Reading file…</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-[280px]">{fileName}</p>
                </div>
              </>
            )}
            {state === "loaded" && (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground font-mono">{fileName}</p>
                  <div className="flex items-center gap-1.5 justify-center mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-700 font-medium">Verified · Ready for AI analysis</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Demo parts */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Use Demo Part</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_PARTS.map(part => (
              <button
                key={part.id}
                onClick={() => load(part.file)}
                className={cn(
                  "group flex flex-col items-center gap-2.5 p-3 rounded-xl border transition-all text-center",
                  fileName === part.file && state === "loaded"
                    ? "border-primary/30 bg-accent/50"
                    : "border-border bg-card hover:border-primary/25 hover:bg-accent/20"
                )}
              >
                <div className="w-full h-10 flex items-center justify-center">
                  {part.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{part.label}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{part.meta}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent files */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Recent Files</p>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {recentFiles.map((f, i) => (
              <button key={i} onClick={() => load(f.name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-left transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{f.size} · {f.opened}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </div>

        <Button disabled={state !== "loaded"} onClick={onNext} className="w-full bg-primary hover:bg-primary/90 text-white h-10 gap-2">
          Begin AI Analysis <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 2: Analysis ─────────────────────────────────────────────────────────

const analysisItems = [
  { ms: 0,    text: "Reading STEP topology"          },
  { ms: 480,  text: "Detecting holes"                },
  { ms: 900,  text: "Detecting fillets"              },
  { ms: 1280, text: "Detecting chamfers"             },
  { ms: 1620, text: "Detecting pockets"              },
  { ms: 1940, text: "Detecting symmetry"             },
  { ms: 2260, text: "Detecting datums"               },
  { ms: 2600, text: "Detecting manufacturing features" },
  { ms: 2960, text: "Reading assembly relationships" },
]
const ANALYSIS_DONE = 3500

function AnalysisStep({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(0)
  const [done, setDone]         = useState(false)

  useEffect(() => {
    const timers = analysisItems.map((item, i) =>
      setTimeout(() => setRevealed(i + 1), item.ms)
    )
    const t = setTimeout(() => setDone(true), ANALYSIS_DONE)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [])

  return (
    <div className="h-full flex items-center justify-center p-8 relative overflow-hidden">
      <WireframeBg />
      <div className="w-full max-w-md flex flex-col gap-6 animate-fade-in relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("w-1.5 h-1.5 rounded-full bg-primary shrink-0", !done && "animate-pulse")} />
            <span className="text-xs text-primary font-medium">{done ? "Analysis complete" : "Analysing…"}</span>
          </div>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">AI Feature Detection</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">motor_housing_v12.step</p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Processing Log</span>
            <span className="text-[10px] font-mono text-muted-foreground">{revealed}/{analysisItems.length}</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {analysisItems.map((item, i) => (
              <div key={i} className={cn("flex items-center gap-3 transition-all duration-250", i < revealed ? "opacity-100" : "opacity-0")}>
                <div className={cn("w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border", i < revealed ? "bg-primary/10 border-primary/25" : "bg-muted border-border")}>
                  {i < revealed && <Check className="w-2.5 h-2.5 text-primary" strokeWidth={2.5} />}
                </div>
                <span className="text-sm text-foreground">{item.text}</span>
                {i < revealed && <span className="ml-auto text-[10px] text-emerald-600 font-mono">done</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={cn("grid grid-cols-3 gap-3 transition-all duration-400", done ? "opacity-100" : "opacity-0")}>
          {[
            { v: "18",      label: "Parts detected"            },
            { v: "146",     label: "Manufacturing features"    },
            { v: "14 sec",  label: "Estimated drawing time"    },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-semibold text-foreground font-mono">{s.v}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        <Button disabled={!done} onClick={onNext} className="w-full bg-primary hover:bg-primary/90 text-white h-10 gap-2">
          Generate 2D Drawing <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3: Generate (drawing + GDT combined) ────────────────────────────────

type GenPhase = "drawing" | "gdt" | "done"

const progressMilestones = [
  { pct: 18, ms: 0, label: "Projecting views…"          },
  { pct: 43, ms: 2200, label: "Adding hidden lines…"    },
  { pct: 67, ms: 4400, label: "Placing dimensions…"     },
  { pct: 91, ms: 6600, label: "Adding section views…"   },
  { pct: 100, ms: 8400, label: "Drawing complete"        },
]

function GenerateStep({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0)
  const [label, setLabel]       = useState("Generating manufacturing drawing…")
  const [phase, setPhase]       = useState<GenPhase>("drawing")

  useEffect(() => {
    const timers = progressMilestones.map(({ pct, ms, label: l }) =>
      setTimeout(() => { setProgress(pct); setLabel(l) }, ms)
    )
    const t = setTimeout(() => setPhase("gdt"), 8400)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [])

  useEffect(() => {
    if (phase !== "gdt") return
    const t = setTimeout(() => setPhase("done"), 2200)
    return () => clearTimeout(t)
  }, [phase])

  const vis: DrawingVis = {
    frontView:    progress >= 5,
    topView:      progress >= 18,
    sideView:     progress >= 30,
    hiddenLines:  progress >= 43,
    centerLines:  progress >= 55,
    dimensions:   progress >= 67,
    sectionMarks: progress >= 85,
    gdt:          phase === "gdt" || phase === "done",
    titleBlock:   progress >= 95,
  }

  const statusLabel =
    phase === "gdt"  ? "Applying GD&T annotations…" :
    phase === "done" ? "Drawing complete" :
    label

  return (
    <div className="h-full flex overflow-hidden animate-fade-in">
      {/* Left: 3D preview */}
      <div className="w-[38%] border-r border-border bg-muted/15 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border bg-card">
          <p className="text-xs font-medium text-foreground">3D Model Preview</p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">motor_housing_v12.step</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-5 relative">
          <div className="absolute inset-0 dots-grid" />
          <div className="w-full max-w-[300px] aspect-[340/300] relative z-10">
            <IsometricCAD />
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {[["Parts", "18"], ["Features", "146"], ["Standard", "ASME Y14.5"], ["Scale", "1 : 2"]].map(([k, v]) => (
              <div key={k}>
                <p className="text-muted-foreground text-[10px]">{k}</p>
                <p className="font-semibold text-foreground font-mono">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: drawing */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-card flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-medium text-foreground">2D Manufacturing Drawing</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{statusLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {phase === "done" ? (
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-border border-t-primary animate-spin" />
            )}
            <span className="text-xs font-mono font-semibold text-foreground">{progress}%</span>
          </div>
        </div>

        <div className="h-0.5 bg-muted shrink-0">
          <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 overflow-auto bg-muted/30 p-5 flex items-start justify-center relative">
          <div className="w-full max-w-[700px] bg-white shadow-sm border border-border rounded-sm">
            <EngineeringDrawing vis={vis} />
          </div>
          {phase === "gdt" && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card border border-primary/20 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full border-2 border-border border-t-primary animate-spin shrink-0" />
              <span className="text-xs text-foreground">Applying GD&T annotations…</span>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-card flex justify-end shrink-0">
          <Button disabled={phase !== "done"} onClick={onNext} className="bg-primary hover:bg-primary/90 text-white gap-2 text-xs h-9">
            {phase === "done" ? <>Review with Hanomi AI <ArrowRight className="w-3.5 h-3.5" /></> : "Generating…"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

const recommendations = [
  {
    id: "pos-tol",
    text: "Position tolerance suggested for hole group",
    detail: "4× M18 hole pattern on ⌀196 B.C. — positional callout recommended per ASME Y14.5-2018 §7.2",
  },
  {
    id: "flatness",
    text: "Flatness callout may improve sealing surface quality",
    detail: "Base mating face — Ra 1.6 surface meets tolerance but flatness annotation adds manufacturing clarity",
  },
]

const readinessChecks = [
  { label: "Dimensions",          detail: "184 verified"  },
  { label: "GD&T",                detail: "42 annotations" },
  { label: "Datums",              detail: "DRF complete"  },
  { label: "Hole Tables",         detail: "8 entries"     },
  { label: "Section Views",       detail: "A-A complete"  },
  { label: "Revision",            detail: "Rev A"         },
  { label: "Title Block",         detail: "Complete"      },
  { label: "Manufacturing Notes", detail: "2 notes"       },
]

function ReviewStep({ onNext }: { onNext: () => void }) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({})
  const [ignored,  setIgnored]  = useState<Record<string, boolean>>({})

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-8 animate-fade-in">

        <div>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Hanomi Review</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-assisted quality validation complete</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: "184",        l: "Dimensions verified" },
            { v: "42",         l: "GD&T annotations"   },
            { v: "ISO 1101",   l: "Standard"            },
            { v: "ASME Y14.5", l: "Compliance"          },
          ].map(s => (
            <div key={s.l} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                <span className="text-[10px] text-emerald-700 font-mono font-medium">verified</span>
              </div>
              <p className="text-base font-semibold text-foreground font-mono leading-none">{s.v}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            2 Recommendations
          </p>
          {recommendations.map(rec => (
            <div key={rec.id} className={cn(
              "border rounded-xl p-4 transition-all duration-200",
              ignored[rec.id]  ? "opacity-40 border-border bg-transparent" :
              accepted[rec.id] ? "border-emerald-200 bg-emerald-50/40" :
              "border-amber-200/70 bg-amber-50/30"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border", accepted[rec.id] ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200")}>
                  {accepted[rec.id]
                    ? <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />
                    : <AlertTriangle className="w-2.5 h-2.5 text-amber-600" strokeWidth={2} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{rec.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.detail}</p>
                </div>
                {!ignored[rec.id] && !accepted[rec.id] && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => setAccepted(p => ({...p, [rec.id]: true}))} className="text-xs px-2.5 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Accept</button>
                    <button className="text-xs px-2.5 py-1 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">Review</button>
                    <button onClick={() => setIgnored(p => ({...p, [rec.id]: true}))} className="text-xs px-2.5 py-1 text-muted-foreground rounded-lg hover:bg-muted transition-colors">Ignore</button>
                  </div>
                )}
                {accepted[rec.id] && <span className="text-xs text-emerald-700 font-medium shrink-0">Accepted</span>}
                {ignored[rec.id]  && <span className="text-xs text-muted-foreground shrink-0">Ignored</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Manufacturing readiness */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Manufacturing Readiness</p>
            <span className="text-sm font-semibold text-foreground font-mono">98% Ready</span>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-2">
              {readinessChecks.map((item, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-4 py-3", i < readinessChecks.length - 2 ? "border-b border-border" : "", i % 2 === 0 ? "border-r border-border" : "")}>
                  <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground">Estimated manual drafting time saved</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-mono">4.8 hours</span>
            </div>
          </div>
        </div>

        <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90 text-white h-10 gap-2">
          Continue to Export <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 5: Export (with dimension inspector) ────────────────────────────────

const EXPORT_ACTIONS = [
  { label: "Export PDF",        icon: FileText,   primary: true  },
  { label: "Export DWG",        icon: Download,   primary: false },
  { label: "Export DXF",        icon: Download,   primary: false },
  { label: "Export Native CAD", icon: Download,   primary: false },
  { label: "Generate Revision", icon: RefreshCw,  primary: false },
  { label: "Share",             icon: Share2,     primary: false },
  { label: "Print",             icon: Printer,    primary: false },
]

function ExportStep({ onClose }: { onClose: () => void }) {
  const [activeDim, setActiveDim]   = useState<string | null>(null)
  const [exporting, setExporting]   = useState<string | null>(null)
  const [accepted,  setAccepted]    = useState<Set<string>>(new Set())
  const [rejected,  setRejected]    = useState<Set<string>>(new Set())

  const dimData = activeDim ? DIMENSIONS.find(d => d.id === activeDim) ?? null : null

  const handleExport = (label: string) => {
    setExporting(label)
    setTimeout(() => setExporting(null), 1800)
  }

  const handleDimClick = useCallback((id: string) => {
    setActiveDim(prev => prev === id ? null : id)
  }, [])

  const vis: DrawingVis = {
    frontView: true, topView: true, sideView: true,
    hiddenLines: true, centerLines: true, dimensions: true,
    sectionMarks: true, gdt: true, titleBlock: true,
  }

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Motor Housing Assembly</p>
            <p className="text-[10px] text-muted-foreground font-mono">PRJ-904-MH-001 · Rev A · ASME Y14.5</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground border border-border bg-muted px-2 py-0.5 rounded">1:2 Scale</span>
          <span className="text-[10px] font-mono text-emerald-700 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">98% Ready</span>
          {activeDim && (
            <span className="text-[10px] font-mono text-primary border border-primary/20 bg-accent px-2 py-0.5 rounded">Inspector open</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex">
        {/* Drawing canvas */}
        <div className="flex-1 overflow-auto bg-muted/30 p-5 flex items-start justify-center relative">
          <div className="w-full max-w-[820px] bg-white shadow-sm border border-border rounded-sm">
            <EngineeringDrawing vis={vis} onDimClick={handleDimClick} activeDim={activeDim} />
          </div>
          {!activeDim && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="px-3 py-1.5 bg-foreground/75 text-background text-[11px] rounded-lg opacity-50">
                Click any orange dimension to inspect
              </span>
            </div>
          )}
        </div>

        {/* Inspector panel */}
        {dimData && (
          <div className="w-68 bg-card border-l border-border flex flex-col shrink-0 animate-fade-in" style={{ width: "268px" }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">Dimension Inspector</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{dimData.label}</p>
              </div>
              <button onClick={() => setActiveDim(null)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              {/* Value */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-foreground font-mono">{dimData.displayValue}</span>
                <span className="text-sm text-muted-foreground">{dimData.unit}</span>
              </div>

              {/* Reasoning */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Generated because</p>
                <div className="flex flex-col gap-2">
                  {dimData.reasoning.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5" />
                      <p className="text-xs text-foreground leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Confidence</p>
                  <span className="text-sm font-semibold text-foreground font-mono">{dimData.confidence}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${dimData.confidence}%` }} />
                </div>
              </div>

              {/* Status badge */}
              {accepted.has(dimData.id) && (
                <div className="flex items-center gap-2 text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <Check className="w-3.5 h-3.5" strokeWidth={2} /> Accepted
                </div>
              )}
              {rejected.has(dimData.id) && (
                <div className="flex items-center gap-2 text-red-700 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <X className="w-3.5 h-3.5" /> Rejected
                </div>
              )}
            </div>

            {/* Actions */}
            {!accepted.has(dimData.id) && !rejected.has(dimData.id) && (
              <div className="p-4 border-t border-border flex flex-col gap-2">
                <Button size="sm" onClick={() => { setAccepted(p => new Set([...p, dimData.id])); setActiveDim(null) }} className="w-full bg-primary hover:bg-primary/90 text-white h-8 text-xs">
                  Accept
                </Button>
                <div className="flex gap-2">
                  <button className="flex-1 text-xs px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors">Edit</button>
                  <button onClick={() => { setRejected(p => new Set([...p, dimData.id])); setActiveDim(null) }} className="flex-1 text-xs px-3 py-1.5 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors">Reject</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export bar */}
      <div className="shrink-0 border-t border-border bg-card px-5 py-3 flex items-center gap-2 overflow-x-auto">
        {EXPORT_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => handleExport(action.label)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0",
              action.primary
                ? "bg-primary hover:bg-primary/90 text-white"
                : "border border-border bg-card hover:bg-muted text-foreground"
            )}
          >
            {exporting === action.label
              ? <div className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              : <action.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
            }
            {exporting === action.label ? "Preparing…" : action.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={onClose} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all shrink-0">
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
          New Drawing
        </button>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function GenerateWorkflow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WorkflowStep>("upload")
  const ci = STEPS.findIndex(s => s.id === step)
  const goNext = useCallback(() => {
    const next = STEPS[ci + 1]
    if (next) setStep(next.id)
  }, [ci])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[52px] border-b border-border bg-card flex items-center px-5 gap-4 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/hanomi_logo.png" alt="Hanomi" className="h-5 w-auto object-contain" />
          <div className="w-px h-4 bg-border" />
          <span className="text-xs text-muted-foreground">
            Generate Drawing
            {step !== "upload" && <span className="font-mono ml-1 opacity-60"> — motor_housing_v12</span>}
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <StepIndicator currentStep={step} />
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {step === "upload"   && <UploadStep   onNext={goNext} />}
        {step === "analysis" && <AnalysisStep onNext={goNext} />}
        {step === "generate" && <GenerateStep onNext={goNext} />}
        {step === "review"   && <ReviewStep   onNext={goNext} />}
        {step === "export"   && <ExportStep   onClose={onClose} />}
      </main>
    </div>
  )
}
