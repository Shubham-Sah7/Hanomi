"use client"

import { useState, useEffect } from "react"
import { Search, Bell, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const recentSearches = [
  "Motor Housing Assembly",
  "Tolerance stack analysis shaft",
  "ASME Y14.5 section view",
  "GD&T runout bore concentricity",
]

const quickCommands = [
  { label: "New drawing from STEP file", shortcut: "⌘N" },
  { label: "Upload assembly", shortcut: "⌘U" },
  { label: "Open standards review", shortcut: "⌘R" },
]

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasNotifications] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleOpenDialog = () => {
    const event = new CustomEvent("open-new-project-dialog")
    window.dispatchEvent(event)
  }

  return (
    <>
      <header className="h-14 bg-card border-b border-border px-6 flex items-center justify-between shrink-0 z-10">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 h-8 rounded-lg border border-border bg-muted/60 hover:bg-muted hover:border-border transition-all text-sm text-muted-foreground w-64"
        >
          <Search className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
          <span className="flex-1 text-left text-sm">Search...</span>
          <kbd className="hidden sm:block text-[10px] font-mono bg-card border border-border px-1.5 py-0.5 rounded text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <Button
            onClick={handleOpenDialog}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-medium h-8 px-3 gap-1.5 rounded-lg shadow-none"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            New Drawing
          </Button>
        </div>
      </header>

      {/* Search dialog */}
      <Dialog open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setSearchQuery("") }}>
        <DialogContent className="max-w-lg p-0 border border-border bg-card shadow-lg rounded-xl overflow-hidden gap-0">
          {/* Input row */}
          <div className="flex items-center gap-3 px-4 border-b border-border h-12">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
            <Input
              placeholder="Search projects, drawings, standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 px-0 text-sm bg-transparent placeholder:text-muted-foreground h-auto py-0 shadow-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="shrink-0">
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {searchQuery === "" ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-2 py-1.5">
                    Recent
                  </p>
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-sm text-foreground text-left transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-2 py-1.5">
                    Quick Actions
                  </p>
                  {quickCommands.map((cmd, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-md hover:bg-muted text-sm text-foreground text-left transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm shrink-0">/</span>
                        {cmd.label}
                      </span>
                      <kbd className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {cmd.shortcut}
                      </kbd>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No results for <span className="text-foreground font-medium">"{searchQuery}"</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching by file name, standard, or project ID
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40">
            <span className="text-[10px] text-muted-foreground font-mono">↑↓ navigate · ↵ open · esc close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
