"use client";

import { useEffect, useState } from "react";
import { BoardContent } from "@/components/board-content";
import { useParams } from "next/navigation";
import { useBoardStore } from "@/store/board.store";
import type { Card } from "@/store/board.store";
import BoardNavbar from "@/components/board-navbar";

const Page = () => {
  const params = useParams();
  const boardId = params.boardId as string;

  const { board } = useBoardStore((state) => state);
  const [cards, setCards] = useState<Card[]>([]);

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