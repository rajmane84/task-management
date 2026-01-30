import { Background } from "@/types/board.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Card = {
  _id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  startDate?: Date | null;
  dueDate?: Date | null;
  labels: string[];
  board?: string;
};

export type BoardStore = {
  board: {
    _id?: string;
    title: string;
    background: Background;
    cards: Card[];
  };
  setBoard: (board: BoardStore["board"]) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  clearBoard: () => void;
};

const initialState = {
  title: "",
  background: {
    type: "color",
    value: "#ffffff"
  } as const,
  cards: [],
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      board: initialState,

      setBoard: (board) => set({ board }),

      addCard: (card) =>
        set((state) => ({
          board: {
            ...state.board,
            cards: [...state.board.cards, card],
          },
        })),

      removeCard: (cardId) =>
        set((state) => ({
          board: {
            ...state.board,
            cards: state.board.cards.filter((c) => c._id !== cardId),
          },
        })),

      updateCard: (cardId, updates) =>
        set((state) => ({
          board: {
            ...state.board,
            cards: state.board.cards.map((c) =>
              c._id === cardId ? { ...c, ...updates } : c
            ),
          },
        })),

      clearBoard: () => set({ board: initialState }),
    }),
    {
      name: "board-storage",
    }
  )
);
