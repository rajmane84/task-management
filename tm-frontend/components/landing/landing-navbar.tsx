import Link from "next/link";
import { Button } from "../ui/button";
import { LayoutGrid } from "lucide-react";

const LandingPageNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <LayoutGrid className="text-blue-600" />
            TaskFlow
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#how" className="hover:text-gray-900">
              How it works
            </a>
            <a href="#testimonials" className="hover:text-gray-900">
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="cursor-pointer">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
  )
}

export default LandingPageNavbar