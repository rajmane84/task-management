import Board from "@/components/board";
import axiosInstance from "@/lib/axios-instance";
import { cookies } from "next/headers";

const Page = async () => {
  let boards = [];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const response = await axiosInstance.get("/board/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieStore.toString(),
      }
    });
    
    boards = response.data?.data || [];
  } catch (error: any) {
    console.error("Fetch Error:", error.response?.status, error.message);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your boards</h1>
        <p className="mt-1 text-sm text-white/60">
          Recently viewed and starred boards
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {boards.length > 0 ? (
          boards.map((board: any, idx: number) => (
            <Board 
              key={idx} 
              title={board.title} 
              boardId={board._id || board.id}
              coverColor={board.color} 
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center border-2 border-dashed border-white/10 rounded-xl">
            <p className="text-white/40 italic">No boards found. Create your first one!</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;