import { Star, Share2 } from "lucide-react";
import Link from "next/link";
import { TaskFlowLogo } from "@/components/logo";
import axiosInstance from "@/lib/axios-instance";
import { cookies } from "next/headers";
import { BoardContent } from "@/components/board-content";

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

interface PageParams {
  boardId: string;
}

const Page = async ({ params }: { params: PageParams }) => {
  const { boardId } = await params;

  const cookieStore =  await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const coverColor = "bg-blue-600";

  let cards: Card[] = [];

  try {
    const response = await axiosInstance.get<Card[]>(`/card/all/${boardId}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    cards = Array.isArray(response.data) ? response.data : [];
    console.log("Fetched cards:", cards);
  } catch (error) {
    console.error("Failed to fetch cards:", error);
  }

  return (
    <div className={`flex min-h-screen flex-col ${coverColor}`}>
      <BoardNavbar />
      <div className="h-14" /> {/* spacing for sticky navbar */}
      <BoardContent boardId={boardId} initialCards={cards} />
    </div>
  );
};

export default Page;

const BoardNavbar = () => {
  return (
    <nav className="sticky top-0 z-20 flex h-14 items-center justify-between bg-black/25 px-6 shadow-sm backdrop-blur-md">
      <Link
        href="/app"
        className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-white/20"
      >
        <TaskFlowLogo width={20} height={20} />
        <span className="hidden text-[16px] font-semibold text-white sm:block">
          TaskFlow
        </span>
      </Link>

      <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
        Board Title
      </h1>

      <div className="flex items-center gap-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/20"
          aria-label="Star board"
        >
          <Star size={16} />
        </button>

        <button className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </nav>
  );
};
