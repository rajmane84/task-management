"use client";

import { useEffect, useState } from "react";
import type { Card } from "@/store/board.store";
import CreateCardModal from "./models/create-card";
import CardDetailsModal from "./models/card-details-model";
import { Clock, MoreVertical } from "lucide-react";

interface BoardContentProps {
  boardId: string;
  initialCards: any[];
}

export const BoardContent: React.FC<BoardContentProps> = ({
  boardId,
  initialCards,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  return (
    <main className="w-full flex-1 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
        {cards.map((card) => {
          const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
          return (
            <button
              onClick={() => setSelectedCard(card)}
              className="group relative w-full rounded-lg bg-black/30 p-4 text-left text-white shadow-sm transition hover:bg-black/40 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            >
              {/* 3-dot menu */}
              <div
                className="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white">
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown (example) */}
                <div className="invisible absolute right-0 mt-1 w-36 rounded-md border border-white/10 bg-neutral-900 text-sm text-white shadow-lg group-focus-within:visible">
                  <button className="block w-full px-3 py-2 text-left hover:bg-white/10">
                    Edit
                  </button>
                  <button className="block w-full px-3 py-2 text-left hover:bg-white/10">
                    Duplicate
                  </button>
                  <button className="block w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10">
                    Delete
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="pr-6 leading-tight font-semibold">{card.title}</h2>

              {/* Description */}
              {card.description && (
                <p className="mt-1 line-clamp-2 text-sm text-white/60">
                  {card.description}
                </p>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                {card.dueDate && (
                  <div
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                      isOverdue
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    } `}
                  >
                    <Clock size={12} />
                    <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Add Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 items-center justify-center rounded-md bg-white/20 text-sm font-medium text-white transition hover:bg-white/20"
        >
          + Add Card
        </button>
      </div>

      {/* Create Card Modal */}
      {isModalOpen && (
        <CreateCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          boardId={boardId}
        />
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </main>
  );
};
