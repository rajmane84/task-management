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
import axiosInstance from "@/lib/axios-instance";

const TASK_COLORS = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
];

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("blue");

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

  async function handleCreateBoard() {
  if (!taskTitle.trim()) return;

  try {
    const response = await axiosInstance.post("/board/create", {
      title: taskTitle.trim(),
      background: selectedColor,
    });

    // Optionally handle the response (update local store or state)
    const createdBoard = response.data.data;

    // Example: if using a store or local state to keep boards
    // addBoard(createdBoard);

    console.log("Board created successfully:", createdBoard);
  } catch (error: any) {
    // Handle errors gracefully
    if (error.response) {
      // Server responded with a status code out of 2xx
      console.error(
        "Failed to create board:",
        error.response.data?.message || error.response.statusText
      );
      alert(
        `Failed to create board: ${
          error.response.data?.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.request);
      alert("No response from server. Please try again later.");
    } else {
      // Something else caused the error
      console.error("Error creating board:", error.message);
      alert(`Error: ${error.message}`);
    }
  } finally {
    // Reset UI state
    setTaskTitle("");
    setSelectedColor("bg-blue-500");
    setIsModalOpen(false);
  }
}


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
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log({
                    title: taskTitle,
                    color: selectedColor,
                  });
                  setIsModalOpen(false);
                }}
              >
                {/* Title input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Task title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Design landing page"
                    autoFocus
                    className={cn(
                      "h-10 w-full rounded-md bg-neutral-800 px-3 text-sm text-white",
                      "ring-1 ring-white/10 outline-none",
                      "placeholder:text-white/40",
                      "focus:ring-2 focus:ring-blue-500",
                    )}
                    required
                  />
                </div>

                {/* Color picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Color
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {TASK_COLORS.map((color) => {
                      const isSelected = selectedColor === color.value;

                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={cn(
                            "relative flex h-9 w-9 items-center justify-center rounded-full transition",
                            color.value,
                            isSelected
                              ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                              : "opacity-80 hover:opacity-100",
                          )}
                          aria-label={color.name}
                        >
                          {isSelected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-md px-4 py-2 text-sm text-white/60 transition hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!taskTitle.trim()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateBoard();
                    }}
                    className={cn(
                      "rounded-md px-5 py-2 text-sm font-medium text-white",
                      "bg-blue-600 transition hover:bg-blue-700",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    Create Task
                  </button>
                </div>
              </form>
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
