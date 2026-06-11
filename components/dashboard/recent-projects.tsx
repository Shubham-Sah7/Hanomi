"use client"

import React from "react"
import { 
  MoreVertical, 
  ArrowRight, 
  Download, 
  FileText, 
  Eye, 
  Trash, 
  Sparkles,
  ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  name: string
  format: string
  size: string
  compliance: string
  modified: string
  progress: number
  status: "ready" | "processing" | "review" | "draft"
  svgThumbnail: React.ReactNode
}

export function RecentProjects() {
  const projects: Project[] = [
    {
      id: "PRJ-904",
      name: "Clutch_Hub_Assembly.step",
      format: "STEP",
      size: "24.6 MB",
      compliance: "ASME Y14.5M",
      modified: "12 mins ago",
      progress: 100,
      status: "ready",
      // SVG Wireframe drawing of a gear/hub
      svgThumbnail: (
        <svg viewBox="0 0 40 40" className="w-full h-full text-sky-400/80 stroke-1" fill="none">
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeDasharray="2,1" />
          <circle cx="20" cy="20" r="18" stroke="currentColor" />
          <circle cx="20" cy="20" r="6" stroke="currentColor" />
          {/* Shaft keyway block */}
          <path d="M18,14 L22,14 L22,16 L18,16 Z" stroke="currentColor" />
          {/* Bolt holes */}
          <circle cx="20" cy="8" r="1.5" stroke="currentColor" />
          <circle cx="20" cy="32" r="1.5" stroke="currentColor" />
          <circle cx="8" cy="20" r="1.5" stroke="currentColor" />
          <circle cx="32" cy="20" r="1.5" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "PRJ-903",
      name: "Bracket_Flange_Support.igs",
      format: "IGES",
      size: "18.1 MB",
      compliance: "ISO 1101",
      modified: "1 hour ago",
      progress: 65,
      status: "processing",
      // SVG Wireframe drawing of a mounting bracket
      svgThumbnail: (
        <svg viewBox="0 0 40 40" className="w-full h-full text-indigo-400/80 stroke-1" fill="none">
          <rect x="6" y="10" width="28" height="20" rx="3" stroke="currentColor" />
          <circle cx="13" cy="20" r="3" stroke="currentColor" />
          <circle cx="27" cy="20" r="3" stroke="currentColor" />
          <line x1="20" y1="10" x2="20" y2="30" stroke="currentColor" strokeDasharray="1,1" />
          <line x1="6" y1="20" x2="34" y2="20" stroke="currentColor" strokeDasharray="1,1" />
        </svg>
      )
    },
    {
      id: "PRJ-902",
      name: "Valve_Housing_Cast.step",
      format: "STEP",
      size: "82.4 MB",
      compliance: "ASME Y14.5M",
      modified: "3 hours ago",
      progress: 92,
      status: "review",
      // SVG Wireframe drawing of a valve housing
      svgThumbnail: (
        <svg viewBox="0 0 40 40" className="w-full h-full text-amber-400/80 stroke-1" fill="none">
          <circle cx="20" cy="18" r="12" stroke="currentColor" />
          <rect x="12" y="30" width="16" height="6" stroke="currentColor" />
          <line x1="16" y1="18" x2="24" y2="18" stroke="currentColor" />
          <line x1="20" y1="14" x2="20" y2="30" stroke="currentColor" />
          <path d="M12,18 C12,28 28,28 28,18" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "PRJ-901",
      name: "Turbine_Rotor_Blades.step",
      format: "STEP",
      size: "142.3 MB",
      compliance: "DIN ISO 2768",
      modified: "1 day ago",
      progress: 100,
      status: "ready",
      // SVG Wireframe drawing of a rotor turbine
      svgThumbnail: (
        <svg viewBox="0 0 40 40" className="w-full h-full text-sky-400/80 stroke-1" fill="none">
          <circle cx="20" cy="20" r="6" stroke="currentColor" />
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeDasharray="3,1" />
          {/* Turbine blades */}
          <path d="M20,14 C17,10 13,8 10,12" stroke="currentColor" />
          <path d="M26,20 C30,17 32,13 28,10" stroke="currentColor" />
          <path d="M20,26 C23,30 27,32 30,28" stroke="currentColor" />
          <path d="M14,20 C10,23 8,27 12,30" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "PRJ-900",
      name: "Locking_Pin_Split.sldprt",
      format: "SLDPRT",
      size: "4.2 MB",
      compliance: "ISO 2768-m",
      modified: "3 days ago",
      progress: 35,
      status: "draft",
      // SVG Wireframe drawing of a simple pin shaft
      svgThumbnail: (
        <svg viewBox="0 0 40 40" className="w-full h-full text-slate-400/80 stroke-1" fill="none">
          <rect x="8" y="16" width="24" height="8" rx="1" stroke="currentColor" />
          <circle cx="8" cy="20" r="3" stroke="currentColor" />
          <line x1="16" y1="16" x2="16" y2="24" stroke="currentColor" />
          <line x1="28" y1="16" x2="28" y2="24" stroke="currentColor" strokeDasharray="1,1" />
        </svg>
      )
    }
  ]

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "ready":
        return (
          <Badge className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider">
            Ready
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-sky-950/50 text-sky-400 border border-sky-500/25 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider animate-pulse">
            Processing
          </Badge>
        )
      case "review":
        return (
          <Badge className="bg-amber-950/50 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider">
            Needs Review
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-zinc-900 text-zinc-400 border border-zinc-700/50 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase tracking-wider">
            Draft
          </Badge>
        )
    }
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card/10 overflow-hidden font-sans flex flex-col">
      {/* Section Header */}
      <div className="p-5 border-b border-border flex items-center justify-between bg-card/20">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-sm font-semibold text-foreground">Recent Drawings & CAD Models</h2>
          <p className="text-[11px] text-muted-foreground">Monitor CAD parsing state, GD&T tolerance checks and PDF/DXF export statuses.</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 border-border text-xs gap-1 hover:bg-muted/40 cursor-pointer">
          <span>View All Files</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/15 font-mono text-[10px] text-muted-foreground uppercase tracking-wider select-none">
              <th className="py-3 px-5 font-semibold">CAD Model Details</th>
              <th className="py-3 px-4 font-semibold">Gaging Compliance</th>
              <th className="py-3 px-4 font-semibold">Last Modified</th>
              <th className="py-3 px-4 font-semibold">Drawing Completeness</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {projects.map((p) => (
              <tr 
                key={p.id} 
                className="hover:bg-muted/20 transition-colors group cursor-pointer"
              >
                {/* CAD File + Wireframe Thumbnail */}
                <td className="py-3.5 px-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/30 border border-border/70 p-1 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-sky-500/20 transition-all">
                    <div className="absolute inset-0 blueprint-grid-fine opacity-20"></div>
                    {p.svgThumbnail}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-foreground hover:text-sky-400 transition-colors text-xs flex items-center gap-1.5">
                      {p.name}
                      <span className="text-[9px] font-mono font-normal text-muted-foreground">({p.id})</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono mt-1">
                      {p.size} &bull; {p.format}
                    </span>
                  </div>
                </td>

                {/* Drafting Standards compliance code */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/80">
                  {p.compliance}
                </td>

                {/* Timestamp */}
                <td className="py-3.5 px-4 text-muted-foreground">
                  {p.modified}
                </td>

                {/* Completion Percentage Bar */}
                <td className="py-3.5 px-4 min-w-[140px]">
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-foreground">{p.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          p.progress === 100 ? "bg-emerald-500" : "bg-sky-400"
                        }`}
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(p.status)}
                </td>

                {/* Actions Dropdown */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-muted/40 cursor-pointer">
                        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 border-border bg-card/95 backdrop-blur-md shadow-xl z-30">
                      <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View 2D Sheet</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>Re-Annotate (AI)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer">
                        <Download className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Export DXF / DWG</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs gap-2 py-2 text-rose-400 focus:text-rose-400 cursor-pointer">
                        <Trash className="w-3.5 h-3.5" />
                        <span>Delete Model</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
