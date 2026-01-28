"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react";
import { TaskFlowLogo } from "@/components/logo";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/cn";
import CreateBoardModal from "./models/create-board";
import type { User as StoreUser } from "@/store/user.store";
import { SearchBar } from "./search";
import useCreateTask from "@/hooks/use-create-task";
import { logoutUser } from "@/services/auth.service";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [searchVal, setSearchVal] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);
  const { createTask } = useCreateTask({
    taskTitle,
    selectedColor,
    setIsModalOpen,
    setSelectedColor,
    setTaskTitle,
  });

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
          "min-h-16 h-16 w-full border-b border-white/10 bg-neutral-900 px-4",
          "sticky top-0 z-40",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/app" className="flex cursor-pointer items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-white">
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
            <SearchBar value={searchVal} onChange={setSearchVal} />
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

            {isUserOptionsOpen && <DropDownMenu user={user} closeMenu={() => setIsUserOptionsOpen(false)} />}
          </div>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <CreateBoardModal
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          selectedColor={selectedColor}
          setIsModalOpen={setIsModalOpen}
          setSelectedColor={setSelectedColor}
          createTask={createTask}
        />
      )}
    </>
  );
};

const UserOptionItem = ({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-2 rounded px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
  >
    {icon}
    <span>{label}</span>
  </Link>
);


const DropDownMenu = ({
  user,
  closeMenu,
}: {
  user: StoreUser | null;
  closeMenu: () => void;
}) => {
  const handleUserLogout = async () => {
    try {
      closeMenu();
      await logoutUser();
      useUserStore.setState({ user: null });
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-white/10 bg-neutral-800 p-1 shadow-xl ring-1 ring-black ring-opacity-5">
      <div className="mb-1 border-b border-white/5 px-3 py-2">
        <p className="text-xs text-white/40">Signed in as</p>
        <p className="truncate text-sm font-medium text-white">
          {user?.email ?? "something@xyz.com"}
        </p>
      </div>

      <UserOptionItem
        icon={<User size={14} />}
        label="Profile"
        href="/app/profile"
        onClick={closeMenu}
      />
      <UserOptionItem
        icon={<Settings size={14} />}
        label="Settings"
        href="/app/settings"
        onClick={closeMenu}
      />
      <UserOptionItem
        icon={<CreditCard size={14} />}
        label="Billing"
        href="/app/billing"
        onClick={closeMenu}
      />

      <div className="my-1 h-px bg-white/5" />

      <button
        onClick={handleUserLogout}
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-400/10"
      >
        <LogOut size={14} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
