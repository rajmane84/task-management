"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { toggleFavoriteApi } from "@/helpers/board.helper";
import { handleApiError } from "@/helpers/handle-error";
import { useBoardStore } from "@/store/board.store";
import axiosInstance from "@/lib/axios-instance";
import { toast } from "sonner";
import { Background } from "@/types/board.type";
import { handleGetBoardDetails, handleToggleFavorite } from "@/services/board.service";

type BoardProps = {
  title: string;
  background: Background;
  boardId: string;
  favorite: boolean;
};

type Card = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  startDate: Date | null;
  dueDate: Date | null;
  comments: string[];
  labels: [];
};

const Board = ({ title, background, boardId, favorite }: BoardProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favorite);
  const setBoard = useBoardStore((state) => state.setBoard);

  const handleClick = async () => {
    try {
        const data = await handleGetBoardDetails(boardId);

        if(!data) return;

        const cards = Array.isArray(data.cards) ? data.cards : []

      setBoard({
        _id: boardId,
        title,
        background: {
          type: background.type,
          value: background.value
        },
        cards,
      });

      router.push(`/board/${boardId}`);
    } catch (error) {
      console.error("Failed to fetch cards", error);
      toast.error("Failed to fetch cards");
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const previousFavorite = isFavorite;

    setIsFavorite((prev) => !prev);

    const message = await handleToggleFavorite(boardId);

    if(!message){
      setIsFavorite(previousFavorite);
    }

    toast.success(message)

  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex min-h-26 min-w-55 cursor-pointer flex-col overflow-hidden rounded-lg bg-neutral-800 text-left shadow-sm transition hover:shadow-md",
      )}
    >
      <div
        className={cn("relative w-full flex-1")}
        style={
          background.type === "color"
            ? { background: background.value }
            : {
                backgroundImage: `url(${background.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="favorite"
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-2 right-2"
              onClick={toggleFavorite}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black/30 backdrop-blur">
                <Star
                  size={14}
                  fill={isFavorite ? "currentColor" : "none"}
                  className={cn(
                    "transition-colors",
                    isFavorite ? "text-yellow-500" : "text-white",
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
