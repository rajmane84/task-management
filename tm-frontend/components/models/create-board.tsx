import React, { FC, FormEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { TASK_COLORS } from "@/constants";

interface CreateBoardModalProps {
  taskTitle: string;
  selectedColor: string;
  setTaskTitle: (title: string) => void;
  setSelectedColor: (color: string) => void;
  setIsModalOpen: (val: boolean) => void;
  createTask: () => void;
}

const CreateBoardModal: FC<CreateBoardModalProps> = ({
  taskTitle,
  selectedColor,
  setTaskTitle,
  setSelectedColor,
  setIsModalOpen,
  createTask,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    createTask();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create New Task</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-white/40 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Title Input Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Task title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Design landing page"
              autoFocus
              className={cn(
                "h-10 w-full rounded-md bg-neutral-800 px-3 text-sm text-white",
                "ring-1 ring-white/10 outline-none",
                "placeholder:text-white/40",
                "focus:ring-2 focus:ring-blue-500"
              )}
              required
            />
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Color</label>
            <div className="flex flex-wrap gap-3">
              {TASK_COLORS.map((color) => {
                const isSelected = selectedColor === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full transition",
                      color.value,
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                        : "opacity-80 hover:opacity-100"
                    )}
                    aria-label={color.name}
                  >
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md px-4 py-2 text-sm text-white/60 transition hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!taskTitle.trim()}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium text-white",
                "bg-blue-600 transition hover:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              Create Task
            </button>
          </div>

        </form>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CreateBoardModal;
