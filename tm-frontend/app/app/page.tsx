import Board from "@/components/board";

const Page = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your boards</h1>
        <p className="mt-1 text-sm text-white/60">
          Recently viewed and starred boards
        </p>
      </header>

      {/* Boards grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Board title="My Trello Board" boardId="12345678" />
        <Board title="Design Sprint – Q1" coverColor="bg-purple-500" boardId="12345678" />
        <Board title="Personal Tasks" coverColor="bg-emerald-500" boardId="12345678" />
      </section>
    </main>
  );
};

export default Page;
