"use client";

import { X, Edit, Save, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Card } from "@/store/board.store";

interface CardDetailsModalProps {
  card: Card;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editable fields
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [labels, setLabels] = useState(card.labels?.join(", ") || "");
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : ""
  );

  const originalData = {
    title: card.title || "",
    description: card.description || "",
    labels: card.labels?.join(", ") || "",
    dueDate: card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : "",
  };

  const handleSave = () => {
    alert(
      `Saved changes:\nTitle: ${title}\nDescription: ${description}\nLabels: ${labels}\nDue Date: ${dueDate}`
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(originalData.title);
    setDescription(originalData.description);
    setLabels(originalData.labels);
    setDueDate(originalData.dueDate);
    setIsEditing(false);
  };

  const handleEditClick = () => setIsEditing(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full mx-auto mt-30 max-w-4xl rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-neutral-800/80 px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 w-full">
            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-white/50"
                placeholder="Enter title..."
              />
            ) : (
              <h2 className="text-xl font-bold text-white truncate">{title || "Untitled Card"}</h2>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition"
              >
                <Edit size={16} /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-500 transition"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 rounded-md bg-gray-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-600 transition"
                >
                  <ArrowLeft size={16} /> Cancel
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 max-h-[80vh] overflow-y-auto">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-white/50"
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-sm text-white/60 leading-relaxed">{description || "No description."}</p>
              )}
            </div>

            {/* Labels */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Labels</h3>
              {isEditing ? (
                <input
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-white/50"
                  placeholder="Comma separated labels"
                />
              ) : (
                <p className="text-sm text-white/60">{labels || "No labels."}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Due Date */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Due Date</h3>
              {isEditing ? (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-white/60">{dueDate || "No due date."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;