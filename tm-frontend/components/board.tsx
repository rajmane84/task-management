"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { toggleFavoriteApi } from "@/helpers/board.helper";
import { handleApiError } from "@/helpers/handle-error";

type BoardProps = {
  title: string;
  coverColor: string;
  boardId: string;
  favorite: boolean;
};

const Board = ({ title, coverColor, boardId, favorite }: BoardProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favorite);

  function handleClick() {
    router.push(`/board/${boardId}`);
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    try {
      setIsFavorite(prev => !prev); // optimistic update
      await toggleFavoriteApi(boardId);
    } catch (error: any) {
      setIsFavorite(favorite); // rollback on error
      handleApiError(error);
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex min-h-26 min-w-55 flex-col overflow-hidden rounded-lg cursor-pointer bg-neutral-800 text-left shadow-sm transition hover:shadow-md"
    >
      <div className={cn("relative flex-1 w-full", coverColor)}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2 top-2"
              onClick={toggleFavorite}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black/30 backdrop-blur">
                <Star
                  size={14}
                  fill={isFavorite ? "currentColor" : "none"}
                  className={cn(
                    "transition-colors",
                    isFavorite ? "text-yellow-500" : "text-white"
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-3 py-2">
        <span className="line-clamp-2 text-sm font-semibold text-white">
          {title}
        </span>
      </div>
    </button>
  );
};


export default Board;
