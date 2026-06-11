"use client"

import React from "react"
import {
  LayoutDashboard,
  Folder,
  FileText,
  Boxes,
  Cpu,
  ClipboardCheck,
  Download,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId =
  | "dashboard"
  | "projects"
  | "drawings"
  | "assemblies"
  | "copilot"
  | "quality"
  | "exports"
  | "settings"

interface SidebarProps {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
}

interface NavItem {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "drawings", label: "Drawings", icon: FileText },
  { id: "assemblies", label: "Assemblies", icon: Boxes },
  { id: "copilot", label: "AI Copilot", icon: Cpu },
  { id: "quality", label: "Quality Review", icon: ClipboardCheck },
  { id: "exports", label: "Exports", icon: Download },
]

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  React.useEffect(() => {
    const allNav = [...primaryNav, { id: "settings" as TabId }]
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !isNaN(Number(e.key))) {
        const index = Number(e.key) - 1
        if (index >= 0 && index < allNav.length) {
          e.preventDefault()
          setActiveTab(allNav[index].id as TabId)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setActiveTab])

  return (
    <aside className="w-[220px] bg-card border-r border-border flex flex-col h-screen shrink-0 select-none">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border shrink-0">
        <img src="/hanomi_logo.png" alt="Hanomi" className="h-6 w-auto object-contain" />
      </div>

      {/* Workspace selector */}
      <div className="px-3 pt-4 pb-2">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left group">
          <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-primary">A</span>
          </div>
          <span className="text-xs font-medium text-foreground flex-1 truncate">Alex's Workspace</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 border-t border-border" />

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-1 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-3 py-1 mb-1">
          Workspace
        </p>
        {primaryNav.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-100 text-left",
                isActive
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" />
              )}
              <Icon
                className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-2 border-t border-border flex flex-col gap-0.5">
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "relative w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-100",
            activeTab === "settings"
              ? "bg-accent text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {activeTab === "settings" && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary" />
          )}
          <Settings
            className={cn("w-4 h-4 shrink-0", activeTab === "settings" ? "text-primary" : "text-muted-foreground")}
            strokeWidth={activeTab === "settings" ? 2 : 1.75}
          />
          <span>Settings</span>
        </button>

        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <HelpCircle className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <span>Help & Docs</span>
        </button>
      </div>

      {/* User */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
            A
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-foreground truncate">Alex Mercer</span>
            <span className="text-[10px] text-muted-foreground">Lead Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
