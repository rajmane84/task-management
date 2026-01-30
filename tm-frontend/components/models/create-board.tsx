import { FC, FormEvent, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BACKGROUND_IMAGES, TASK_COLORS } from "@/constants";
import type { Background } from "@/types/board.type";
import { handleCreateBoard } from "@/services/board.service";
import { useRouter } from "next/navigation";

interface CreateBoardModalProps {
  setIsModalOpen: (val: boolean) => void;
}


const CreateBoardModal: FC<CreateBoardModalProps> = ({
  setIsModalOpen,
}) => {
  const [title, setTitle] = useState<string>("");
  const [bg, setBg] = useState<Background>({
    type: "color",
    value: TASK_COLORS[0].value,
  });
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      title,
      background: {
        type: bg.type,
        value: bg.value
      },
    };

    const response = await handleCreateBoard(payload);

    if(!response){
      setIsModalOpen(false);
      return;
    }

    setIsModalOpen(false);
    setTitle("");
    router.refresh();
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
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Task title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design landing page"
              autoFocus
              className={cn(
                "h-10 w-full rounded-md bg-neutral-800 px-3 text-sm text-white",
                "ring-1 ring-white/10 outline-none",
                "placeholder:text-white/40",
                "focus:ring-2 focus:ring-blue-500",
              )}
              required
            />
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Colors</label>
            <div className="flex flex-wrap gap-3">
              {TASK_COLORS.map((color) => {
                const isSelected =
                  bg.type === "color" && bg.value === color.value;

                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setBg({ type: "color", value: color.value })
                    }
                    className={cn(
                      "relative h-9 w-9 rounded-full transition",
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                        : "opacity-80 hover:opacity-100",
                    )}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Images</label>
            <div className="flex flex-wrap gap-3">
              {BACKGROUND_IMAGES.map((image) => {
                const isSelected =
                  bg.type === "image" && bg.value === image.value;

                return (
                  <button
                    key={image.value}
                    type="button"
                    onClick={() =>
                      setBg({ type: "image", value: image.value })
                    }
                    className={cn(
                      "relative h-12 w-20 overflow-hidden rounded-md transition",
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                        : "opacity-80 hover:opacity-100",
                    )}
                    style={{
                      backgroundImage: `url(${image.value})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-label={image.name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
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
              disabled={!title.trim()}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium text-white",
                "bg-blue-600 transition hover:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>

      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CreateBoardModal;
