import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Hash } from "lucide-react";
import Link from "next/link";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavItem = ({
  icon,
  label,
  badge,
  active,
  onClick,
  className,
}: NavItemProps) => (
  <Link
    href={label.toLocaleLowerCase()}
    onClick={onClick}
    className={cn(
      "group flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-all duration-200",
      active
        ? "bg-[#363636] text-white"
        : "text-[#eeeeee]/80 hover:bg-[#363636] hover:text-white",
      className,
    )}
  >
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "transition-colors",
          active ? "text-inherit" : "text-gray-400 group-hover:text-white",
        )}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </div>
    {badge && <span className="text-xs opacity-60">{badge}</span>}
  </Link>
);

export const ProjectItem = ({ label }: { label: string }) => (
  <NavItem icon={<Hash size={18} className="text-gray-500" />} label={label} />
);
