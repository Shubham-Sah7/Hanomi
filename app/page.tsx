"use client"

import { useState, useEffect } from "react"
import { Sidebar, TabId } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/topnav"
import { TryHanomi } from "@/components/dashboard/try-hanomi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FolderClosed,
  Layers,
  Cpu,
  Send,
  CheckCircle,
  Download,
  Upload,
  ChevronRight,
  FolderPlus,
  Box,
  User,
  ArrowRight,
  FileText,
  FilePen,
  ClipboardCheck,
  Clock,
} from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const recentProjects = [
  {
    id: "PRJ-904",
    name: "Motor Housing Assembly",
    compliance: "ASME Y14.5",
    modified: "2 hrs ago",
    progress: 94,
    status: "review" as const,
    drawings: 8,
    thumbnail: (
      <svg viewBox="0 0 260 140" fill="none" className="w-full h-full">
        {/* Front view */}
        <rect x="20" y="20" width="100" height="70" stroke="#C8C2BA" strokeWidth="0.9" />
        <rect x="10" y="88" width="120" height="10" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="70" cy="55" r="22" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="70" cy="55" r="8" stroke="#C8C2BA" strokeWidth="0.6" strokeDasharray="3,2" />
        <circle cx="28" cy="28" r="4" stroke="#C8C2BA" strokeWidth="0.7" />
        <circle cx="112" cy="28" r="4" stroke="#C8C2BA" strokeWidth="0.7" />
        <circle cx="28" cy="82" r="4" stroke="#C8C2BA" strokeWidth="0.7" />
        <circle cx="112" cy="82" r="4" stroke="#C8C2BA" strokeWidth="0.7" />
        {/* Top view */}
        <rect x="20" y="4" width="100" height="14" stroke="#C8C2BA" strokeWidth="0.7" />
        {/* Side view */}
        <rect x="135" y="20" width="48" height="70" stroke="#C8C2BA" strokeWidth="0.9" />
        <rect x="128" y="88" width="62" height="10" stroke="#C8C2BA" strokeWidth="0.9" />
        {/* Dimensions */}
        <line x1="20" y1="108" x2="120" y2="108" stroke="#F47A20" strokeWidth="0.6" />
        <text x="70" y="116" textAnchor="middle" fontSize="7" fill="#F47A20">240mm</text>
        {/* GD&T */}
        <rect x="47" y="12" width="46" height="6" fill="none" stroke="#F47A20" strokeWidth="0.5" />
        <text x="70" y="17" textAnchor="middle" fontSize="4.5" fill="#F47A20">⌖ ⌀0.05 A B</text>
        {/* Center lines */}
        <line x1="8" y1="55" x2="132" y2="55" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        <line x1="70" y1="2" x2="70" y2="122" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        {/* Title stub */}
        <rect x="180" y="110" width="70" height="22" fill="none" stroke="#D4CEC8" strokeWidth="0.5" />
        <text x="215" y="119" textAnchor="middle" fontSize="5" fill="#78716C">PRJ-904-MH-001</text>
        <text x="215" y="127" textAnchor="middle" fontSize="5" fill="#F47A20">HANOMI</text>
      </svg>
    ),
  },
  {
    id: "PRJ-903",
    name: "Valve Housing Cast",
    compliance: "ASME Y14.5",
    modified: "4 hrs ago",
    progress: 100,
    status: "ready" as const,
    drawings: 12,
    thumbnail: (
      <svg viewBox="0 0 260 140" fill="none" className="w-full h-full">
        {/* Front view */}
        <circle cx="78" cy="62" r="42" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="78" cy="62" r="18" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="78" cy="62" r="6" stroke="#C8C2BA" strokeWidth="0.6" />
        {/* Ports */}
        <rect x="72" y="6" width="12" height="16" stroke="#C8C2BA" strokeWidth="0.7" />
        <rect x="72" y="102" width="12" height="16" stroke="#C8C2BA" strokeWidth="0.7" />
        <rect x="6" y="56" width="16" height="12" stroke="#C8C2BA" strokeWidth="0.7" />
        <rect x="134" y="56" width="16" height="12" stroke="#C8C2BA" strokeWidth="0.7" />
        {/* Side view */}
        <rect x="170" y="30" width="54" height="64" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="197" cy="62" r="16" stroke="#C8C2BA" strokeWidth="0.6" strokeDasharray="3,2" />
        {/* Center lines */}
        <line x1="4" y1="62" x2="152" y2="62" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        <line x1="78" y1="2" x2="78" y2="122" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        {/* Ready badge area */}
        <rect x="168" y="106" width="74" height="26" fill="none" stroke="#C8C2BA" strokeWidth="0.5" />
        <text x="205" y="116" textAnchor="middle" fontSize="5" fill="#78716C">PRJ-903 · Rev B</text>
        <text x="205" y="126" textAnchor="middle" fontSize="5.5" fill="#22C55E">✓ Mfg. Ready</text>
      </svg>
    ),
  },
  {
    id: "PRJ-901",
    name: "Turbine Rotor Blades",
    compliance: "DIN 2768",
    modified: "1 day ago",
    progress: 65,
    status: "processing" as const,
    drawings: 4,
    thumbnail: (
      <svg viewBox="0 0 260 140" fill="none" className="w-full h-full">
        {/* Circular front view */}
        <circle cx="75" cy="68" r="50" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="75" cy="68" r="12" stroke="#C8C2BA" strokeWidth="0.9" />
        <circle cx="75" cy="68" r="5" stroke="#C8C2BA" strokeWidth="0.6" />
        {/* Blade profiles */}
        <path d="M75,18 C71,32 67,48 75,56" stroke="#C8C2BA" strokeWidth="0.9" fill="none" />
        <path d="M75,80 C83,88 83,100 75,118" stroke="#C8C2BA" strokeWidth="0.9" fill="none" />
        <path d="M25,68 C38,72 52,73 60,68" stroke="#C8C2BA" strokeWidth="0.9" fill="none" />
        <path d="M90,68 C98,62 108,60 125,68" stroke="#C8C2BA" strokeWidth="0.9" fill="none" />
        <path d="M40,33 C49,42 54,51 52,59" stroke="#C8C2BA" strokeWidth="0.8" fill="none" />
        <path d="M98,77 C106,85 110,94 109,103" stroke="#C8C2BA" strokeWidth="0.8" fill="none" />
        {/* Top view inset */}
        <rect x="155" y="22" width="88" height="30" stroke="#C8C2BA" strokeWidth="0.7" />
        <ellipse cx="199" cy="37" rx="28" ry="9" stroke="#C8C2BA" strokeWidth="0.6" />
        {/* Center lines */}
        <line x1="4" y1="68" x2="130" y2="68" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        <line x1="75" y1="4" x2="75" y2="132" stroke="#F47A20" strokeWidth="0.4" strokeDasharray="6,3,2,3" opacity="0.6" />
        {/* Processing indicator */}
        <rect x="153" y="70" width="90" height="26" fill="none" stroke="#C8C2BA" strokeWidth="0.5" />
        <text x="198" y="80" textAnchor="middle" fontSize="5" fill="#78716C">PRJ-901 · In Progress</text>
        <rect x="157" y="84" width="82" height="4" fill="none" stroke="#C8C2BA" strokeWidth="0.4" />
        <rect x="157" y="84" width="53" height="4" fill="#F47A20" opacity="0.4" />
        <text x="198" y="102" textAnchor="middle" fontSize="5" fill="#78716C">DIN 2768 · 65%</text>
      </svg>
    ),
  },
]

const recentFiles = [
  { name: "Clutch_Hub_Assembly.step", format: "STEP", opened: "12 min ago", compliance: "ASME Y14.5", size: "24.6 MB" },
  { name: "Valve_Housing_Cast.step", format: "STEP", opened: "1 hr ago", compliance: "ASME Y14.5", size: "82.4 MB" },
  { name: "Bracket_Flange_Support.igs", format: "IGES", opened: "3 hrs ago", compliance: "ISO 1101", size: "18.1 MB" },
  { name: "Turbine_Rotor_Blades.step", format: "STEP", opened: "Yesterday", compliance: "DIN 2768", size: "142.3 MB" },
]

const engineeringStandards = [
  { code: "ASME Y14.5", name: "Dimensioning & Tolerancing", active: true },
  { code: "ISO 1101", name: "Geometric Tolerancing", active: false },
  { code: "DIN 2768", name: "General Tolerances", active: false },
]

const copilotCommands = [
  "Generate section views for current model",
  "Review tolerance stack on Datum A",
  "Check manufacturing readiness",
  "Export drawing to DXF format",
  "Add GD&T frame to selected feature",
]

// ─── Status helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "ready" | "review" | "processing" | "draft" }) {
  const map = {
    ready:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    review:     "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-orange-50 text-primary border-primary/20",
    draft:      "bg-muted text-muted-foreground border-border",
  }
  const label = { ready: "Ready", review: "Needs Review", processing: "Processing", draft: "Draft" }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {label[status]}
    </span>
  )
}

// ─── Dashboard view ───────────────────────────────────────────────────────────

function DashboardView({ onNewDrawing }: { onNewDrawing: () => void }) {
  const [copilotInput, setCopilotInput] = useState("")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const actionCards = [
    {
      icon: FilePen,
      title: "Generate Drawing",
      description: "Convert 3D CAD into manufacturing-ready 2D drawings with GD&T annotations.",
      meta: "ASME Y14.5 · ISO 1101",
      onClick: onNewDrawing,
      primary: true,
    },
    {
      icon: Upload,
      title: "Upload Assembly",
      description: "Analyze multi-part assemblies, extract BOM and component relationships.",
      meta: "STEP · IGES · Parasolid",
      onClick: onNewDrawing,
      primary: false,
    },
    {
      icon: ClipboardCheck,
      title: "Standards Review",
      description: "Review GD&T callouts, tolerance stacks and compliance with ASME or ISO.",
      meta: "Automated compliance check",
      onClick: () => {},
      primary: false,
    },
  ]

  return (
    <div className="flex flex-col gap-12 animate-fade-in">
      {/* ── Welcome ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-semibold text-foreground tracking-tight leading-tight">
          Good morning, Alex.
        </h1>
        <p className="text-base text-muted-foreground">What would you like to create today?</p>
      </div>

      {/* ── Action Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionCards.map((card, i) => (
          <button
            key={i}
            onClick={card.onClick}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group text-left p-6 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-150 flex flex-col gap-5 cad-corners"
            style={{ transform: hoveredCard === i ? "translateY(-1px)" : "none", transition: "all 0.18s cubic-bezier(0.23,1,0.32,1)" }}
          >
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${card.primary ? "border-primary/30 bg-accent" : "border-primary/20 bg-accent"}`}>
              <card.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground/60">{card.meta}</span>
              <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Recent Projects ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-card border border-border rounded-xl hover:border-primary/25 hover:shadow-sm transition-all cursor-pointer flex flex-col overflow-hidden"
            >
              {/* Drawing preview — large */}
              <div className="h-[160px] bg-muted/30 border-b border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 dots-grid opacity-60" />
                <div className="absolute inset-0 blueprint-grid-fine opacity-20" />
                <div className="w-full h-full p-4 relative z-10">{project.thumbnail}</div>
                {/* CAD corners */}
                <span className="absolute top-2 left-2 text-[9px] font-mono text-muted-foreground/40">TL</span>
                <span className="absolute top-2 right-2 text-[9px] font-mono text-muted-foreground/40">TR</span>
                <span className="absolute bottom-2 left-2 text-[9px] font-mono text-primary/30">{project.compliance}</span>
                <span className="absolute bottom-2 right-2 text-[9px] font-mono text-muted-foreground/40">{project.drawings} sheets</span>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] font-mono text-muted-foreground">{project.id}</span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{project.name}</h3>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                {/* Readiness bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Manufacturing readiness</span>
                    <span className="text-[11px] font-semibold font-mono" style={{ color: project.progress === 100 ? "rgb(22,163,74)" : project.progress >= 90 ? "var(--primary)" : "rgb(245,158,11)" }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.progress === 100 ? "rgb(22,163,74)" : project.progress >= 90 ? "var(--primary)" : "rgb(245,158,11)"
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                    <span>{project.modified}</span>
                  </div>
                  <span className="text-xs text-primary font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Continue Working ── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">Continue Working</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {recentFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg border border-border bg-muted/60 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {file.format} · {file.size} · Opened {file.opened}
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground border border-border bg-muted/60 px-2 py-0.5 rounded shrink-0 hidden sm:block">
                {file.compliance}
              </span>
              <ArrowRight
                className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0"
                strokeWidth={1.75}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Standards + Copilot ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Engineering Standards */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-foreground">Engineering Standards</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {engineeringStandards.map((std, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      std.active ? "bg-primary" : "bg-border"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{std.code}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{std.name}</p>
                  </div>
                </div>
                {std.active ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-accent text-primary border border-primary/20 rounded-full">
                    Active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot — command palette style */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-foreground">Ask Hanomi</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            {/* Commands */}
            <div className="p-2">
              {copilotCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => setCopilotInput(cmd)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors group"
                >
                  <span className="text-primary font-mono text-sm shrink-0 group-hover:text-primary">/</span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {cmd}
                  </span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border px-4 py-3 flex items-center gap-3 bg-muted/30">
              <span className="text-primary font-mono text-base leading-none shrink-0">›</span>
              <input
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Type a command or question..."
                className="flex-1 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none min-w-0"
              />
              <button
                className="shrink-0 w-6 h-6 rounded flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors"
                onClick={() => setCopilotInput("")}
              >
                <ArrowRight className="w-3 h-3 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Other views (kept, not the focus of this redesign) ──────────────────────

function ProjectsView({ onNew }: { onNew: () => void }) {
  const projects = [
    { name: "Powertrain Gearbox v4", count: "12 drawings", status: "Active", standard: "ASME Y14.5" },
    { name: "Chassis Suspension Mounts", count: "8 drawings", status: "Active", standard: "ISO 1101" },
    { name: "Steering Column Linkage", count: "4 drawings", status: "Archived", standard: "ASME Y14.5" },
  ]
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage 3D CAD repositories and multi-part assemblies.</p>
        </div>
        <Button onClick={onNew} size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5 text-xs">
          <FolderPlus className="w-4 h-4" />
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((prj, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card hover:border-primary/25 transition-all cursor-pointer group flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="w-9 h-9 rounded-lg bg-accent border border-primary/15 flex items-center justify-center">
                <FolderClosed className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${prj.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border"}`}>
                {prj.status}
              </span>
            </div>
            <div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{prj.name}</span>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-1.5">
                <span>{prj.count}</span>
                <span>·</span>
                <span>{prj.standard}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Open folder</span>
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DrawingsView() {
  const drawings = [
    { sheet: "A3 Sheet 1", title: "Orthographic Projections", model: "Clutch_Hub_Assembly.step", date: "12m ago", scale: "1:1" },
    { sheet: "A3 Sheet 2", title: "Section Views A-A & B-B", model: "Clutch_Hub_Assembly.step", date: "15m ago", scale: "1:2" },
    { sheet: "A4 Sheet 1", title: "Detailed Bore Fits & Tolerances", model: "Bracket_Flange_Support.igs", date: "1h ago", scale: "2:1" },
  ]
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">2D Drawing Sheets</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Manage orthographic sheets, title blocks, and revisions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {drawings.map((dwg, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/25 transition-all cursor-pointer group">
            <div className="h-44 bg-muted/40 border-b border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 dots-grid" />
              <div className="absolute inset-3 border border-border/60 flex items-center justify-center">
                <div className="absolute bottom-0 right-0 w-24 h-10 border-t border-l border-border p-1 font-mono text-[6px] text-muted-foreground flex flex-col justify-between">
                  <div>HANOMI</div>
                  <div className="flex justify-between"><span>REV 2</span><span>{dwg.scale}</span></div>
                </div>
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-muted-foreground/40" fill="none">
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,2" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,2" />
                </svg>
              </div>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-card/90 text-foreground font-mono text-[9px] border border-border rounded">
                Scale {dwg.scale}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-primary font-semibold">{dwg.sheet}</span>
                <span className="text-[10px] text-muted-foreground">{dwg.date}</span>
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{dwg.title}</span>
              <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{dwg.model}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssembliesView() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">CAD Component Hierarchy</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Navigate sub-assemblies, individual parts, and fastener trees.</p>
      </div>
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-foreground font-semibold border-b border-border pb-3">
          <Layers className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span>Clutch_Gearbox_Assembly.step</span>
          <span className="text-muted-foreground font-normal">(5 nodes active)</span>
        </div>
        <div className="flex flex-col gap-2.5 text-[11px]">
          {[
            { indent: 0, label: "[ASM_09] Gearbox_Housing_Cover", meta: "Ready", active: true },
            { indent: 1, label: "[PRT_22] Top_Lid_Plate.step", meta: "ASME Y14.5: 99%", active: false },
            { indent: 1, label: "[PRT_23] M6_Fastener_Bores", meta: "Auto-annotated", active: false },
            { indent: 0, label: "[ASM_10] Transmission_Shaft_Sub", meta: "In Review", active: true },
            { indent: 1, label: "[PRT_44] Main_Drive_Shaft.step", meta: "Tolerance review required", active: false },
          ].map((node, i) => (
            <div key={i} className={`flex items-center gap-2 ${node.indent ? "pl-8" : ""}`} style={{ color: node.active ? "var(--primary)" : "var(--muted-foreground)" }}>
              {!node.indent && <span className="text-border">──</span>}
              {node.indent ? <span className="text-border">└──</span> : null}
              <Box className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span className={node.active ? "text-foreground font-semibold" : ""}>{node.label}</span>
              <span className="text-muted-foreground font-sans">·</span>
              <span className="text-muted-foreground font-sans">{node.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type ChatMessage = { sender: "bot" | "user"; text: string; time: string }

function CopilotView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hanomi CAD Copilot ready. I can calculate tolerance stacks, add GD&T frames, or extract bill of materials. What can I help you design today?", time: "15:28" },
  ])
  const [input, setInput] = useState("")

  const handleSend = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input
    setMessages(prev => [...prev, { sender: "user", text: userMsg, time: "now" }])
    setInput("")
    setTimeout(() => {
      let reply = "Analyzing CAD geometry..."
      if (userMsg.toLowerCase().includes("tolerance") || userMsg.toLowerCase().includes("gd&t")) {
        reply = "Recommended runout tolerance: 0.05mm on Datum A (cylindrical bore) per ASME Y14.5. Auto-generate feature control frame?"
      } else if (userMsg.toLowerCase().includes("export") || userMsg.toLowerCase().includes("dxf")) {
        reply = "Queued Shaft_Assembly_2D.dxf — A3 Sheet, Scale 1:2. Available in Exports."
      } else if (userMsg.toLowerCase().includes("bom")) {
        reply = "BOM extracted: 4× M8 hex bolts, 1× upper housing cover, 1× drive sprocket, 2× ball bearings. Generating table on sheet 4."
      }
      setMessages(prev => [...prev, { sender: "bot", text: reply, time: "now" }])
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-8rem)]">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI Copilot</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Interactively review tolerances, write annotations, and manage drawing layers.</p>
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden flex flex-col md:flex-row min-h-0">
        <div className="flex-1 flex flex-col border-r border-border min-h-0">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${msg.sender === "user" ? "bg-muted border-border" : "bg-accent border-primary/20"}`}>
                  {msg.sender === "user" ? <User className="w-3 h-3 text-muted-foreground" /> : <Cpu className="w-3 h-3 text-primary" />}
                </div>
                <div className={`p-3 rounded-xl text-xs ${msg.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-muted border border-border rounded-tl-none"}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] font-mono mt-1 block ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Copilot..." className="flex-1 text-xs h-8" />
            <Button type="submit" size="icon" className="w-8 h-8 bg-primary hover:bg-primary/90 text-white shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
        <div className="w-full md:w-52 p-4 flex flex-col gap-3 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Suggested</span>
          {["Calculate tolerance stack", "Add ASME runout frame", "Export assembly DXF", "Generate BOM table"].map((s, i) => (
            <button key={i} onClick={() => setInput(s)} className="text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-lg border border-border hover:border-primary/20 text-left transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function QualityView() {
  const checks = [
    { title: "Cylindrical Runout Fit", check: "Datum Alignment A-B", status: "Pass" },
    { title: "Weldment Flatness", check: "ISO 13920 class C", status: "Pass" },
    { title: "Bore Concentricity", check: "ASME 0.05mm limit", status: "Pending" },
  ]
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">GD&T Quality Review</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Review tolerance stacking, coordinate indices overlap, and standard compliances.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {checks.map((item, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.check}</span>
              <span className={`text-[10px] font-mono font-semibold ${item.status === "Pass" ? "text-emerald-600" : "text-amber-600"}`}>{item.status}</span>
            </div>
            <span className="font-semibold text-foreground text-sm mt-1">{item.title}</span>
            <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
              <div className={`h-full ${item.status === "Pass" ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: item.status === "Pass" ? "100%" : "50%" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-3">
        <span className="text-xs font-semibold text-foreground">Tolerance Stack Trace</span>
        <div className="font-mono text-[11px] text-muted-foreground flex flex-col gap-1.5 p-3 rounded-lg bg-muted/50">
          <div>[INFO] Stack checks started for Shaft_Assembly_v2</div>
          <div>[OK] Radial clearance: 0.125mm (Required &gt; 0.100mm)</div>
          <div className="text-amber-600">[WARN] Hole overlap on M8 tapping: 0.012mm deviation from nominal</div>
          <div>[OK] Concentricity limits passed on main drive interface</div>
        </div>
      </div>
    </div>
  )
}

function ExportsView() {
  const formats = [
    { format: "DXF Vector File", desc: "AutoCAD compatible, complete geometry layers, annotated dimensions.", action: "Download DXF (1.2 MB)" },
    { format: "High-Res PDF", desc: "Print-ready layout, ISO/ASME template formats, embedded GD&T notes.", action: "Download PDF (3.4 MB)" },
    { format: "STEP 3D Model", desc: "Original solid geometry with updated tolerance metadata.", action: "Download STEP (24.6 MB)" },
  ]
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Export Formats</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configure CAD drawings exports to DXF, DWG, PDF, or STEP files.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map((exp, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent border border-primary/15 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-foreground text-sm">{exp.format}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs w-max">
              {exp.action}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Workspace Preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configure global CAD parameters, standard defaults, and AI rules.</p>
      </div>
      <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Tolerance Class</label>
            <select className="bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40">
              <option>ISO 2768-m (Medium)</option>
              <option>ISO 2768-f (Fine)</option>
              <option>ISO 2768-c (Coarse)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Standard Units</label>
            <select className="bg-muted border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40">
              <option>Metric (mm)</option>
              <option>Imperial (in)</option>
            </select>
          </div>
        </div>
        <div className="border-t border-border pt-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-foreground">Compliance Flags</span>
          {[
            { label: "Verify thread interference alignments", checked: true },
            { label: "Alert on dimension redundancy (ASME rules)", checked: true },
            { label: "Calculate tolerance stacks before sheets render", checked: false },
          ].map((s, i) => (
            <label key={i} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
              <input type="checkbox" defaultChecked={s.checked} className="rounded accent-primary w-3.5 h-3.5" />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [workflowOpen, setWorkflowOpen] = useState(false)

  useEffect(() => {
    const handler = () => setWorkflowOpen(true)
    window.addEventListener("open-new-project-dialog", handler)
    return () => window.removeEventListener("open-new-project-dialog", handler)
  }, [])

  const openWorkflow = () => setWorkflowOpen(true)
  const closeWorkflow = () => { setWorkflowOpen(false); setActiveTab("drawings") }

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":   return <DashboardView onNewDrawing={openWorkflow} />
      case "projects":    return <ProjectsView onNew={openWorkflow} />
      case "drawings":    return <DrawingsView />
      case "assemblies":  return <AssembliesView />
      case "copilot":     return <CopilotView />
      case "quality":     return <QualityView />
      case "exports":     return <ExportsView />
      case "settings":    return <SettingsView />
      default:            return null
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {renderView()}
        </main>
      </div>

      {workflowOpen && <TryHanomi onClose={closeWorkflow} />}
    </div>
  )
}
