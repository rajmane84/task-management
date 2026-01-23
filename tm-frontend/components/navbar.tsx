import { TaskFlowLogo } from "@/app/(auth)/signin/page"
import { ChevronDown, Search, Plus } from "lucide-react"

const Navbar = () => {
  return (
    <header className="h-16 w-full border-b border-white/10 bg-neutral-900 px-4">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-white">
            <TaskFlowLogo width={20} height={20} className="fill-neutral-900 stroke-none" />
          </div>
          <span className="hidden text-sm font-semibold text-white sm:block">
            TaskFlow
          </span>
        </div>

        {/* Center: Search + Create */}
        <div className="flex flex-1 items-center justify-center gap-3">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search tasks, projects…"
              className="h-9 w-full rounded-md bg-neutral-800 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Create button */}
          <button className="hidden items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:flex">
            <Plus size={16} />
            Create
          </button>
        </div>

        {/* Right: User menu */}
        <button className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-white/10">
          <div className="h-7 w-7 rounded-full bg-linear-to-tr from-blue-500 to-blue-700" />
          <span className="hidden truncate text-sm font-semibold text-white sm:block">
            Raj
          </span>
          <ChevronDown size={14} className="text-white/60" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
