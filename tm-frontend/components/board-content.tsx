"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios-instance";
import { createCardSchema } from "@/lib/schema/create-card.schema";
import z from "zod";
import { useBoardStore } from "@/store/board.store";

interface Card {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  startDate?: string;
  dueDate?: string;
  assignedTo?: string;
  labels?: string[];
  boardId: string;
}

interface BoardContentProps {
  boardId: string;
  initialCards: Card[];
}

export const BoardContent: React.FC<BoardContentProps> = ({ boardId, initialCards }) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setBoard = useBoardStore((state) => state.setBoard);

  const form = useForm({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      startDate: "",
      dueDate: "",
      assignedTo: "",
      labels: [],
      boardId,
    },
  });

  const handleCreateCard = async (data: z.infer<typeof createCardSchema>) => {
    try {
      const response = await axiosInstance.post("/card/create", data);
      setCards(prev => [...prev, response.data]);
      setIsModalOpen(false);
      form.reset({ boardId });
    } catch (error) {
      console.error("Failed to create card:", error);
      alert("Failed to create card. Try again.");
    }
  };

  return (
    <main className="w-full flex-1 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        {cards.map(card => (
          <div
            key={card.id}
            className="rounded-md bg-black/25 p-4 text-white shadow-sm"
          >
            <h2 className="font-semibold">{card.title}</h2>
            {card.description && <p className="text-sm text-white/60 mt-1">{card.description}</p>}
            {card.dueDate && <p className="text-xs text-white/40 mt-2">Due: {card.dueDate}</p>}
          </div>
        ))}

        {/* Small "Add Card" button as the last item */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center h-12 rounded-md bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition"
        >
          + Add Card
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create Card</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(handleCreateCard)}>
              <div className="space-y-1">
                <label className="text-sm text-white">Title</label>
                <input
                  {...form.register("title")}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
                  placeholder="Card title"
                  required
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-400">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white">Description</label>
                <textarea
                  {...form.register("description")}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
              >
                Create
              </button>
            </form>
          </div>

          <div className="fixed inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
        </div>
      )}
    </main>
  );
};
