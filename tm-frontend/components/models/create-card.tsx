"use client"

import { useForm } from "react-hook-form";
import { X, Calendar, Tag, User, AlignLeft, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { KeyboardEvent, useState } from "react";
import { handleCreateCard } from "@/services/card.service";
import { useBoardStore } from "@/store/board.store";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

const CreateCardModal = ({ isOpen, onClose, boardId }: CreateCardModalProps) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addCard = useBoardStore(state => state.addCard)

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      dueDate: "",
      assignedTo: "",
      boardId,
      completed: false,
    }
  });

  if (!isOpen) return null;

  const handleAddLabel = (e?: KeyboardEvent<HTMLInputElement>) => {
    if (e) e.preventDefault();
    
    const trimmed = currentLabel.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
      setCurrentLabel("");
    }
  };

  const removeLabel = (indexToRemove: number) => {
    setLabels(labels.filter((_, index) => index !== indexToRemove));
  };

  const submitForm = async (data: any) => {
  setIsSubmitting(true);
  try {
    const formattedData = {
      ...data,
      boardId,
      labels: labels,
      startDate: data.startDate || null,
      dueDate: data.dueDate || null,
      assignedTo: data.assignedTo || null,
      completed: false
    };

    const response = await handleCreateCard(formattedData);

    addCard({
      _id: response?._id,
      title: data.title,
      description: data.description,
      labels: labels,
      completed: false,
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      board: boardId
    });
    
    reset();
    setLabels([]); 
    onClose();
  } catch (error) {
    console.error("Submission failed", error);
    // handleApiError is likely called within handleCreateCard already
  } finally {
    setIsSubmitting(false);
  }
};

  const labelStyles = "flex items-center gap-2 text-sm font-medium text-neutral-400";
  const inputStyles = cn(
    "w-full rounded-lg bg-neutral-800 px-3 py-2 text-white outline-none",
    "ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500",
    "transition-all placeholder:text-neutral-500"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl transition-all relative">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">New Task Card</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
          <div className="space-y-1">
            <label className={labelStyles}>
              Title <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className={cn(inputStyles, errors.title && "ring-red-500/50 focus:ring-red-500")}
              placeholder="What needs to be done?"
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className={labelStyles}>
              <AlignLeft size={14} /> Description
            </label>
            <textarea
              {...register("description")}
              className={cn(inputStyles, "resize-none")}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelStyles}><Calendar size={14} /> Start Date</label>
              <input type="date" {...register("startDate")} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className={labelStyles}><Calendar size={14} /> Due Date</label>
              <input type="date" {...register("dueDate")} className={inputStyles} />
            </div>
          </div>

          {/* <div className="space-y-1">
            <label className={labelStyles}><User size={14} /> Assigned To</label>
            <input {...register("assignedTo")} className={inputStyles} placeholder="User ID" />
          </div> */}

          <div className="space-y-2">
            <label className={labelStyles}><Tag size={14} /> Labels</label>
            <div className="relative">
              <input
                type="text"
                value={currentLabel}
                onChange={(e) => setCurrentLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLabel();
                  }
                }}
                className={inputStyles}
                placeholder="Press Enter to add labels"
              />
              <button 
                type="button"
                onClick={() => handleAddLabel()}
                className="absolute right-2 top-1.5 p-1 rounded hover:bg-white/10 text-neutral-400"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-6">
              {labels.map((label, index) => (
                <span key={index} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">
                  {label}
                  <button type="button" onClick={() => removeLabel(index)} className="hover:text-blue-200">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={cn(
                "w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
                "hover:bg-blue-700 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Card"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default CreateCardModal;