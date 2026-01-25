import { Share2 } from "lucide-react";
import { TaskFlowLogo } from "./logo";
import Link from "next/link";

const BoardNavbar = ({ title = "Fallback title" }: { title?: string }) => {
  return (
    <nav className="sticky top-0 z-20 flex h-14 items-center justify-between bg-black/25 px-6 shadow-sm backdrop-blur-md">
      <Link
        href="/app"
        className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-white/20"
      >
        <TaskFlowLogo width={20} height={20} />
        <span className="hidden text-[16px] font-semibold text-white sm:block">
          TaskFlow
        </span>
      </Link>

      <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </nav>
  );
};

export default BoardNavbar;
