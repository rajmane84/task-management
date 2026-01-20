"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Inbox,
  Calendar,
  Layers,
  MoreHorizontal,
  Bell,
  HelpCircle,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { NavItem, ProjectItem } from "@/components/sidebar-component";
import { cn } from "@/lib/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1e1e1e] font-sans selection:bg-red-500/30">
      {/* SIDEBAR CONTAINER */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 280 : 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden border-r border-white/5 bg-[#282828] select-none",
          !isOpen && "border-none",
        )}
      >
        <div className="flex h-full w-70 flex-col">
          {/* Profile & Controls */}
          <div className="mb-2 flex items-center justify-between p-4">
            <button className="flex items-center gap-2 truncate rounded-md p-1 transition-colors hover:bg-white/5">
              <div className="h-6 min-w-6 rounded-full border border-white/10 bg-linear-to-tr from-orange-500 to-red-600" />
              <span className="truncate text-sm font-semibold">Raj</span>
              <ChevronDown size={14} className="shrink-0 opacity-50" />
            </button>
            <div className="flex items-center gap-2 opacity-60">
              <button className="rounded-md p-1.5 hover:bg-white/10">
                <Bell size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 hover:bg-white/10"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Area */}
          <nav className="custom-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3">
            <NavItem
              icon={<Plus size={20} className="text-[#db4c3f]" />}
              label="Add task"
              className="font-bold text-[#db4c3f] hover:text-[#db4c3f]"
            />
            <NavItem icon={<Search size={20} />} label="Search" />
            <NavItem
              icon={<Inbox size={20} className="text-blue-400" />}
              label="Inbox"
              badge={4}
            />
            <NavItem
              icon={<Calendar size={20} className="text-green-500" />}
              label="Today"
              active
            />
            <NavItem
              icon={<Calendar size={20} className="text-purple-400" />}
              label="Upcoming"
            />
            <NavItem
              icon={<Layers size={20} className="text-orange-400" />}
              label="Filters & Labels"
            />
            <NavItem icon={<MoreHorizontal size={20} />} label="More" />

            {/* Projects Section */}
            <div className="mt-8">
              <div className="group flex cursor-pointer items-center justify-between px-3 py-2">
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  My Projects
                </span>
                <Plus
                  size={16}
                  className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
              <ProjectItem label="Home 🏡" />
            </div>
          </nav>

          {/* Footer Card */}
          <div className="border-t border-white/5 bg-[#282828] p-4">
            <div className="mb-4 rounded-xl border border-white/5 bg-[#363636] p-4 shadow-lg">
              <h4 className="mb-1 text-sm font-bold">Feeling stuck?</h4>
              <p className="mb-4 text-[12px] leading-relaxed text-gray-400">
                Our support guides are just a click away.
              </p>
              <button className="w-full rounded-lg bg-[#e44332] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#c3392b] active:scale-[0.98]">
                Thanks!
              </button>
            </div>
            <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-gray-400 transition-colors hover:text-white">
              <HelpCircle size={18} />
              <span>Help & resources</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-4 left-4 z-10 rounded-md p-2 text-gray-400 transition-colors hover:bg-white/5"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl px-6 py-12 md:px-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
