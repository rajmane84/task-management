"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  Plus,
  X,
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react";
import { TaskFlowLogo } from "@/app/(auth)/signin/page";
import { cn } from "@/lib/cn";
import { useUserStore } from "@/store/user.store";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={cn(
          "h-16 w-full border-b border-white/10 bg-neutral-900 px-4",
          "sticky top-0 z-40",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/app"
            className="group flex cursor-pointer items-center gap-2"
          >
            <div className="flex size-9 items-center justify-center rounded-md bg-white transition-transform group-hover:scale-105">
              <TaskFlowLogo
                width={20}
                height={20}
                className="fill-neutral-900 stroke-none"
              />
            </div>
            <span className="hidden text-sm font-semibold text-white sm:block">
              TaskFlow
            </span>
          </Link>

          {/* Search + Create */}
          <div className="flex flex-1 items-center justify-center gap-3">
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search tasks, projects…"
                className={cn(
                  "h-9 w-full rounded-md bg-neutral-800 pr-3 pl-9 text-sm text-white",
                  "ring-1 ring-white/10 outline-none placeholder:text-white/40",
                  "transition-all focus:ring-2 focus:ring-blue-500",
                )}
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "hidden items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white",
                "transition hover:bg-blue-700 active:scale-95 sm:flex",
              )}
            >
              <Plus size={16} />
              Create
            </button>
          </div>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserOptionsOpen(!isUserOptionsOpen)}
              className={cn(
                "flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-white/10",
                isUserOptionsOpen && "bg-white/10",
              )}
            >
              <div className="h-7 w-7 rounded-full bg-linear-to-tr from-blue-500 to-blue-700" />
              <span className="hidden truncate text-sm font-semibold text-white sm:block">
                {user?.username ? user.username : "Fallback"}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "text-white/60 transition-transform",
                  isUserOptionsOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserOptionsOpen && (
              <div className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-white/10 bg-neutral-800 p-1 shadow-xl ring-1 ring-black focus:outline-none">
                <div className="mb-1 border-b border-white/5 px-3 py-2">
                  <p className="text-xs text-white/40">Signed in as</p>
                  <p className="truncate text-sm font-medium text-white">
                    {user?.email ? user.email : "something@xyz.com"}
                  </p>
                </div>

                <UserOptionItem
                  icon={<User size={14} />}
                  label="Profile"
                  href="/profile"
                />
                <UserOptionItem
                  icon={<Settings size={14} />}
                  label="Settings"
                  href="/settings"
                />
                <UserOptionItem
                  icon={<CreditCard size={14} />}
                  label="Billing"
                  href="/billing"
                />

                <div className="my-1 h-px bg-white/5" />

                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-400/10"
                  onClick={() => console.log("Logging out...")}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal logic remains same */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 transition-colors hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Ready to start something new? Fill in the details below.
              </p>
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-white/10">
                <span className="text-xs text-white/20 italic">
                  Form fields placeholder
                </span>
              </div>
              <button className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                Confirm
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

const UserOptionItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-2 rounded px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;
