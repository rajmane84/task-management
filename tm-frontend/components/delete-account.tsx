"use client";

import { deleteUser } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DeleteAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

  function handleDeleteClick() {
    setIsModalOpen(true);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);

    try {
      const response = await deleteUser();
      if (!response) return;
      toast.success(response.data.message || "Account deleted successfully");
      setIsModalOpen(false);
      router.replace("/signup")
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      cancelButtonRef.current?.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Danger Zone Card */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="mb-4 text-sm text-neutral-400">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteClick}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
        >
          Delete Account
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="animate-fadeIn w-full max-w-md rounded-lg border border-neutral-700 bg-neutral-900 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-red-400">
              Are you absolutely sure?
            </h3>
            <p className="mb-6 text-sm text-neutral-400">
              Deleting your account is permanent and cannot be undone. This
              action will remove all your data.
            </p>
            <div className="flex justify-end gap-3">
              <button
                ref={cancelButtonRef}
                onClick={handleCancel}
                className="rounded-md bg-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${isDeleting ? "cursor-not-allowed bg-red-600" : "bg-red-500 text-white hover:bg-red-400"} `}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;
