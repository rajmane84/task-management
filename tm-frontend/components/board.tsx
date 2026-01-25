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
  const setBoard = useBoardStore((state) => state.setBoard);

async function handleClick() {
    let response;

    try {
      response = await axiosInstance.get(`/card/all/${boardId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to fetch cards", error);
      toast.error("Failed to fetch cards")
      response = { data: { data: [] } };
    }
    const cards = Array.isArray(response?.data?.data) ? response.data.data : [];

    setBoard({
      _id: boardId,
      title,
      background: coverColor,
      cards,
    });

    router.push(`/board/${boardId}`);
  }

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    try {
      setIsFavorite((prev) => !prev); // optimistic update
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
      className="group relative flex min-h-26 min-w-55 cursor-pointer flex-col overflow-hidden rounded-lg bg-neutral-800 text-left shadow-sm transition hover:shadow-md"
    >
      <div className={cn("relative w-full flex-1", coverColor)}>
        <AnimatePresence>
          {hovered && (
            <motion.div
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
