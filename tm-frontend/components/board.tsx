"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type BoardProps = {
  title: string;
  coverColor?: string;
  boardId: string;
};

const Board = ({ title, coverColor = "bg-blue-500", boardId }: BoardProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  function handleClick() {
    router.push(`/board/${boardId}`);
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex min-h-26 min-w-55 flex-col overflow-hidden rounded-lg cursor-pointer",
        "bg-neutral-800 text-left shadow-sm transition",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      )}
    >
      {/* Cover */}
      <div
        className={cn(
          "relative flex-1 w-full transition group-hover:brightness-90",
          coverColor
        )}
      >
        {/* Star icon */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 12, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute right-2 top-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black/30 text-white backdrop-blur">
                <Star size={14} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title */}
      <div className="flex items-center px-3 py-2">
        <span className="line-clamp-2 text-sm font-semibold text-white">
          {title}
        </span>
      </div>
    </button>
  );
};

export default Board;
