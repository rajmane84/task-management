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

  const background = board.background;

  return (
    <div className={`flex min-h-screen flex-col`} 
    style={
          background.type === "color"
            ? { background: background.value }
            : {
                backgroundImage: `url(${background.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }>
      <BoardNavbar title={board?.title} />
      <div className="h-14" /> {/* spacing for sticky navbar */}
      <BoardContent boardId={boardId} initialCards={cards} />
    </div>
  );
};

export default Page;