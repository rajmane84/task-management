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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        {cards.map((card) => (
          <button
            key={card._id}
            onClick={() => setSelectedCard(card)}
            className="text-left rounded-md bg-black/25 p-4 text-white shadow-sm transition hover:bg-black/35"
          >
            <h2 className="font-semibold">{card.title}</h2>

            {card.description && (
              <p className="text-sm text-white/60 mt-1 line-clamp-2">
                {card.description}
              </p>
            )}

            {card.dueDate && (
              <p className="text-xs text-white/40 mt-2">
                Due: {new Date(card.dueDate).toLocaleDateString()}
              </p>
            )}
          </button>
        ))}

        {/* Add Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center h-12 rounded-md bg-white/20 text-white text-sm font-medium hover:bg-white/20 transition"
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
