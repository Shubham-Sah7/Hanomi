"use client"

import React from "react"
import { 
  Cpu, 
  ClipboardCheck, 
  Download, 
  FileCode, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  type: "ai_generation" | "quality_review" | "export" | "warning"
  meta: string
}

export function ActivityTimeline() {
  const activities: ActivityItem[] = [
    {
      id: "ACT-005",
      title: "AI Layout Sheets Generated",
      description: "Auto-projected Front, Top, Right, and Section B-B views for Valve_Housing_Cast.step.",
      timestamp: "12 mins ago",
      type: "ai_generation",
      meta: "4 orthographic sheets • Scale 1:1"
    },
    {
      id: "ACT-004",
      title: "GD&T Stack Compliance Pass",
      description: "ASME Y14.5M tolerance evaluation passed on Gearbox_Base.step interface faces.",
      timestamp: "1 hour ago",
      type: "quality_review",
      meta: "98.7% dimension validation score"
    },
    {
      id: "ACT-003",
      title: "DXF Drawing Pack Exported",
      description: "Clutch_Hub_Assembly_Drawing.dxf successfully generated and packaged for CNC routing.",
      timestamp: "4 hours ago",
      type: "export",
      meta: "DXF format • v2 revision track"
    },
    {
      id: "ACT-002",
      title: "Revision Sync Warning",
      description: "Clash detected in outer face coordinate indices on Bracket_v3.step vs local drawings.",
      timestamp: "Yesterday, 3:40 PM",
      type: "warning",
      meta: "0.25mm mismatch on center bore"
    },
    {
      id: "ACT-001",
      title: "AI First-Pass Annotations",
      description: "Generated 34 dimension notes and surface finish indicators for Sprocket_Drive_v1.step.",
      timestamp: "Jun 08, 9:15 AM",
      type: "ai_generation",
      meta: "ISO 1302 Surface Finishes"
    }
  ]

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "ai_generation":
        return (
          <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        )
      case "quality_review":
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ClipboardCheck className="w-3.5 h-3.5" />
          </div>
        )
      case "export":
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Download className="w-3.5 h-3.5" />
          </div>
        )
      case "warning":
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        )
    }
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card/10 overflow-hidden font-sans flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between bg-card/20 select-none">
        <div className="flex items-center gap-2 text-left">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Engine Activity Log</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/40 border border-border/80 px-2 py-0.5 rounded">
          LIVE FEED
        </span>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-5 relative">
        {/* Continuous Timeline Line */}
        <div className="absolute left-[33px] top-6 bottom-6 w-px bg-border/60"></div>

        <div className="flex flex-col gap-6">
          {activities.map((item) => (
            <div key={item.id} className="flex gap-4 relative group">
              {/* Left Icon (pinned) */}
              <div className="shrink-0 z-10 bg-background/50 rounded-lg">
                {getIcon(item.type)}
              </div>

              {/* Details Body */}
              <div className="flex-1 flex flex-col text-left border border-transparent group-hover:border-border/20 group-hover:bg-muted/10 p-2.5 rounded-lg transition-all duration-150 -mt-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground text-xs">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.timestamp}</span>
                </div>
                
                <p className="text-[11px] text-muted-foreground leading-normal mt-1">
                  {item.description}
                </p>

                {/* Sub Metadata field */}
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-sky-400/80">
                  <span className="w-1 h-1 rounded-full bg-sky-500/60"></span>
                  <span>{item.meta}</span>
                  <span className="text-muted-foreground/30 font-normal">({item.id})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 border-t border-border bg-card/15 text-center mt-auto">
        <button className="text-[11px] text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-1 group transition-colors">
          <span>View complete execution history</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
