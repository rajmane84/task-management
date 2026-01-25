"use client";

import { useEffect, useState } from "react";
import { Star, Share2 } from "lucide-react";
import Link from "next/link";
import { TaskFlowLogo } from "@/components/logo";
import { BoardContent } from "@/components/board-content";
import { useParams } from "next/navigation";
import { useBoardStore } from "@/store/board.store";
import type { Card } from "@/store/board.store";

const Page = () => {
  const params = useParams();
  const boardId = params.boardId as string;
  const { board } = useBoardStore((state) => state);

  // Start with empty array
  const [cards, setCards] = useState<Card[]>([]);

  // Update cards whenever board.cards changes
  useEffect(() => {
    if (board?.cards) {
      setCards(board.cards);
    }
  }, [board?.cards]);

  const coverColor = board?.background || "bg-blue-600";

  return (
    <div className={`flex min-h-screen flex-col ${coverColor}`}>
      <BoardNavbar title={board?.title} />
      <div className="h-14" /> {/* spacing for sticky navbar */}
      <BoardContent boardId={boardId} initialCards={cards} />
    </div>
  );
};

export default Page;

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
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/20"
          aria-label="Star board"
        >
          <Star size={16} />
        </button>

        <button className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </nav>
  );
};
