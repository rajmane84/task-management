"use client";

import { handleCreateBoard } from "@/services/board.service";
import { useRouter } from "next/navigation";

const useCreateTask = ({
  taskTitle,
  selectedColor,
  setIsModalOpen,
  setSelectedColor,
  setTaskTitle,
}: {
  taskTitle: string;
  selectedColor: string;
  setIsModalOpen: (v: boolean) => void;
  setSelectedColor: (v: string) => void;
  setTaskTitle: (v: string) => void;
}) => {
  const router = useRouter();

  const createTask = async () => {
    const payload = {
      title: taskTitle,
      background: selectedColor,
    };

    const uiSetterfunc = {
      setIsModalOpen,
      setBackground: setSelectedColor,
      setTitle: setTaskTitle,
    };

    try {
      await handleCreateBoard(payload, uiSetterfunc);
      router.refresh();
    } catch (err) {
      console.error("Create task failed", err);
    }
  };

  return { createTask };
};

export default useCreateTask;
