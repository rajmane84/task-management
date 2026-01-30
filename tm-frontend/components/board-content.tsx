"use client";

import { useEffect, useState } from "react";
import type { Card } from "@/store/board.store";
import CreateCardModal from "./models/create-card";
import CardDetailsModal from "./models/card-details-model";

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
        {cards.map((card) => (
          <button
            key={card._id}
            onClick={() => setSelectedCard(card)}
            className="rounded-md bg-black/25 p-4 text-left text-white shadow-sm transition hover:bg-black/35"
          >
            <h2 className="font-semibold">{card.title}</h2>

            {card.description && (
              <p className="mt-1 line-clamp-2 text-sm text-white/60">
                {card.description}
              </p>
            )}

            {card.dueDate && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-700 px-2 py-1 text-xs text-white">
                <span className="opacity-70 font-semibold">Due: </span>
                <span className="font-medium">
                  {new Date(card.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </button>
        ))}

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
