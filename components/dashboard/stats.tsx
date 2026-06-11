"use client"

import React from "react"
import { 
  FolderClosed, 
  FileCheck2, 
  Hourglass, 
  CheckCircle2, 
  ArrowUpRight, 
  HelpCircle 
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Stats() {
  const statsData = [
    {
      title: "Total Projects",
      value: "42",
      change: "+12% vs last month",
      icon: FolderClosed,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-950/45 border-sky-500/20",
      tooltip: "Total active and archived CAD assemblies inside this workspace.",
      // Custom SVG Mini Line Chart
      chart: (
        <svg className="w-20 h-8 text-sky-400" viewBox="0 0 100 30" fill="none">
          <path 
            d="M0,25 Q15,22 30,12 T60,18 T90,2 T100,5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M0,25 Q15,22 30,12 T60,18 T90,2 T100,5 L100,30 L0,30 Z" 
            fill="url(#sky-gradient)" 
            opacity="0.15" 
          />
          <defs>
            <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(14, 165, 233)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Drawings Generated",
      value: "1,248",
      change: "+84 this week",
      icon: FileCheck2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/45 border-emerald-500/20",
      tooltip: "Total orthographic, cross-sectional, and detailed 2D sheets created.",
      // Custom SVG Bar Chart
      chart: (
        <svg className="w-20 h-8 text-emerald-400" viewBox="0 0 100 30" fill="none">
          <rect x="0" y="12" width="6" height="18" rx="1" fill="currentColor" opacity="0.3" />
          <rect x="12" y="8" width="6" height="22" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="24" y="16" width="6" height="14" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="36" y="10" width="6" height="20" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="48" y="4" width="6" height="26" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="60" y="14" width="6" height="16" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="72" y="11" width="6" height="19" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="84" y="2" width="6" height="28" rx="1" fill="currentColor" />
        </svg>
      )
    },
    {
      title: "Time Saved",
      value: "324 hrs",
      change: "Average 4.2h per model",
      icon: Hourglass,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-950/45 border-indigo-500/20",
      tooltip: "Estimated engineering drafting time saved based on manual annotations vs. AI generation.",
      // Custom SVG Area Chart
      chart: (
        <svg className="w-20 h-8 text-indigo-400" viewBox="0 0 100 30" fill="none">
          <path 
            d="M0,28 C20,28 30,5 50,15 C70,25 80,2 100,5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M0,28 C20,28 30,5 50,15 C70,25 80,2 100,5 L100,30 L0,30 Z" 
            fill="url(#indigo-gradient)" 
            opacity="0.15" 
          />
          <defs>
            <linearGradient id="indigo-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: "Mfg Readiness Score",
      value: "94.8%",
      change: "GD&T compliance high",
      icon: CheckCircle2,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-950/45 border-amber-500/20",
      tooltip: "Combined metric measuring tolerance viability, dimension sufficiency, and drawing completeness.",
      // Custom Radial Gauge Chart
      chart: (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90">
            {/* Background circle */}
            <circle 
              cx="20" 
              cy="20" 
              r="16" 
              stroke="oklch(1 0 0 / 8%)" 
              strokeWidth="3.5" 
              fill="transparent" 
            />
            {/* Active gauge */}
            <circle 
              cx="20" 
              cy="20" 
              r="16" 
              stroke="rgb(251, 191, 36)" 
              strokeWidth="3.5" 
              strokeDasharray="100" 
              strokeDashoffset="5" 
              strokeLinecap="round"
              fill="transparent" 
            />
          </svg>
          <span className="absolute text-[8px] font-mono text-amber-400 font-bold">95%</span>
        </div>
      )
    }
  ]

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full font-sans">
        {statsData.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <div 
              key={idx} 
              className="p-5 rounded-xl border border-border bg-card/20 hover:border-border-hover hover:bg-card/35 transition-all duration-200 relative group tech-border-subtle"
            >
              {/* Corner tech line decoration */}
              <div className="absolute top-0 right-0 w-3 h-px bg-border group-hover:bg-sky-500/40 transition-colors"></div>
              <div className="absolute top-0 right-0 w-px h-3 bg-border group-hover:bg-sky-500/40 transition-colors"></div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    {stat.title}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-card text-foreground border border-border text-[11px] max-w-[200px] leading-relaxed">
                        {stat.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</span>
                </div>
                
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>

              {/* Lower Section with Trend Chart / Info */}
              <div className="flex items-end justify-between mt-4 pt-3 border-t border-border/20">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-[10px] text-muted-foreground font-mono leading-none">TREND</span>
                  <span className="text-[11px] text-foreground font-medium font-mono leading-none mt-1">{stat.change}</span>
                </div>
                <div className="shrink-0">
                  {stat.chart}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
