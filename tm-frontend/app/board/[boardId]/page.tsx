import { Star, Share2 } from "lucide-react";
import Link from "next/link";
import { TaskFlowLogo } from "@/app/(auth)/signin/page";

const Page = async ({ params }: { params: Promise<{ boardId: string }> }) => {
  const { boardId } = await params;

  // This would normally come from DB
  const coverColor = "bg-blue-600";

  return (
    <div className={`flex min-h-screen flex-col ${coverColor}`}>
      <BoardNavbar />

      {/* Board content */}
      <main className="ow-full flex flex-1 flex-row p-4">
        <div className="text-md w-full px-4 py-2 text-white">
          Board ID: {boardId}
        </div>
      </main>
    </div>
  );
};

export default Page;

const BoardNavbar = () => {
  return (
    <nav className="sticky top-0 z-20 flex h-14 items-center justify-between bg-black/25 px-6 backdrop-blur-md shadow-sm">
      <Link
        href="/app"
        className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-white/20"
      >
        <TaskFlowLogo width={20} height={20} />
        <span className="hidden text-[16px] font-semibold text-white sm:block">
          TaskFlow
        </span>
      </Link>

      {/* Center: Board title */}
        <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
          Board Title
        </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Star button */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/20"
          aria-label="Star board"
        >
          <Star size={16} />
        </button>

        {/* Share button */}
        <button className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </nav>
  );
};
