import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Trash } from "lucide-react";
import { updateUserAvatar } from "@/services/user.service";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";

type AvatarModalProps = {
  onClose: () => void;
  currentAvatar?: string;
};

export const AvatarModal = ({ onClose, currentAvatar }: AvatarModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore(state => state.user);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  async function onSave(file: File | null) {
    if (!file) return;

    const response = await updateUserAvatar(file);

    if (!response) return;

    toast.success(`${response.message}` || "Avatar updated successfully");
    setUser({
      name: user!.name,
      username: user!.username,
      email: user!.email,
      avatarUrl: response.avatar ? response.avatar as string : "",
    });
  }

  const handleSave = () => {
    if (removed) {
      onSave?.(null);
    } else {
      onSave?.(file);
    }
    onClose();
  };

  useEffect(() => {
    setPreview(currentAvatar ?? null);
    setFile(null);
    setRemoved(false);
  }, [currentAvatar]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onSave?.(null);
    setRemoved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Change avatar
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="mt-6 flex justify-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            {preview ? (
              <Image
                src={preview}
                alt="Avatar preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                No avatar
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <Upload className="h-4 w-4" />
            Upload image
          </button>

          {preview && (
            <button
              onClick={handleRemove}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
            >
              <Trash className="h-4 w-4" />
              Remove avatar
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!file && !removed}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
