import { useState, useRef, useEffect } from "react";
import { MoreVertical, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import  type { Card as CardData }  from "@/store/board.store";

export interface CardProps {
  card: CardData;
  onSelect: (card: CardData) => void;
  onEdit: (card: CardData) => void;
  onDuplicate: (card: CardData) => void;
  onDelete: (card: CardData) => void;
}

export function Card({ card, onSelect, onEdit, onDuplicate, onDelete }: CardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isOverdue =
    card.dueDate && new Date(card.dueDate) < new Date();

  // Close menu on outside click
  useEffect(() => {

    // @ts-ignore
    function handleClickOutside(e) {
        //@ts-ignore
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className="
        group relative w-full rounded-lg bg-black/30 p-4 text-white
        shadow-sm transition-all duration-150 ease-out
        hover:bg-black/40 hover:shadow-md hover:-translate-y-0.5
        focus-within:ring-2 focus-within:ring-blue-500/40
      "
    >
      {/* Card main click area */}
      <button
        onClick={() => onSelect(card)}
        className="block w-full text-left focus:outline-none"
      >
        {/* Title */}
        <h2 className="pr-8 text-sm font-semibold leading-tight">
          {card.title}
        </h2>

        {/* Description */}
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-white/50">
            {card.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          {card.dueDate && (
            <div
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
                isOverdue
                  ? "bg-red-500/20 text-red-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
              title={
                isOverdue
                  ? "This card is overdue"
                  : "Upcoming due date"
              }
            >
              <Clock size={12} />
              <span>
                {isOverdue ? "Overdue" : "Due"}{" "}
                {formatDistanceToNow(new Date(card.dueDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* 3-dot menu */}
      <div
        ref={menuRef}
        className="absolute top-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="
            rounded-md p-1 text-white/60
            hover:bg-white/10 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500/40
          "
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div
            className="
              absolute right-0 mt-1 w-36 rounded-md
              border border-white/10 bg-neutral-900
              text-sm shadow-lg
            "
            role="menu"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(card);
              }}
              className="block w-full px-3 py-2 text-left hover:bg-white/10"
              role="menuitem"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDuplicate(card);
              }}
              className="block w-full px-3 py-2 text-left hover:bg-white/10"
              role="menuitem"
            >
              Duplicate
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(card);
              }}
              className="block w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
