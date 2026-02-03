"use client";

import { useEffect, useState } from "react";
import type { Card as CardData } from "@/store/board.store";
import CreateCardModal from "./models/create-card";
import CardDetailsModal from "./models/card-details-model";
import { Card } from "../components/card"; // Assuming you saved the first component as Card.tsx

interface BoardContentProps {
  boardId: string;
  initialCards: CardData[];
}

export const BoardContent: React.FC<BoardContentProps> = ({
  boardId,
  initialCards,
}) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // Handlers for Card actions
  const handleEdit = (card: CardData) => {
    console.log("Edit card:", card._id);
    // Logic for opening an edit state or modal
  };

  const handleDuplicate = (card: CardData) => {
    console.log("Duplicate card:", card._id);
    // Logic for calling your API to duplicate
  };

  const handleDelete = (card: CardData) => {
    if (confirm("Are you sure you want to delete this card?")) {
      setCards((prev) => prev.filter((c) => c._id !== card._id));
      // Logic for calling your API to delete
    }
  };

  return (
    <main className="w-full flex-1 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onSelect={(c) => setSelectedCard(c)}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}

        {/* Add Card Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex h-[100px] items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-transparent text-sm font-medium text-white/60 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
        >
          + Add Card
        </button>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateCardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          boardId={boardId}
        />
      )}

      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </main>
  );
};