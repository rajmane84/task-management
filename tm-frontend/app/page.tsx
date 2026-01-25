import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Star,
  LayoutGrid,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageNavbar from "@/components/landing/landing-navbar";
import Feature from "@/components/landing/feature";
import Testimonial from "@/components/landing/testimonial";

const featureList = [
  {
    icon: LayoutGrid,
    title: "Flexible Boards",
    desc: "Visualize work with boards, lists, and cards.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Comment, assign, and mention teammates instantly.",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Automate repetitive tasks and save hours every week.",
  },
  {
    icon: Clock,
    title: "Due Dates",
    desc: "Stay on track with reminders and deadlines.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "Your data is encrypted and protected.",
  },
  {
    icon: CheckCircle,
    title: "Insights",
    desc: "Track progress and productivity at a glance.",
  },
];

const testimonials = [
  {
    quote: "TaskFlow completely changed how our team works.",
    name: "Sarah Johnson",
    role: "Product Manager",
    rating: 4
  },
  {
    quote: "Simple, fast, and actually enjoyable to use.",
    name: "Michael Chen",
    role: "CTO",
    rating: 4
  },
  {
    quote: "Our productivity skyrocketed after switching.",
    name: "Emily Davis",
    role: "Design Lead",
  },
];

const getStarted= [
              {
                step: "01",
                title: "Create a board",
                desc: "Set up your workspace in seconds.",
              },
              {
                step: "02",
                title: "Invite your team",
                desc: "Bring everyone together instantly.",
              },
              {
                step: "03",
                title: "Ship faster",
                desc: "Stay aligned and get more done.",
              },
            ]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LandingPageNavbar />

      {/* HERO */}
      <section className="bg-linear-to-b from-blue-50 to-white pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            New • AI-powered task suggestions
          </span>

          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
            Bring all your work <br />
            <span className="text-blue-600">together in one place</span>
          </h1>

          <p className="mb-10 text-lg text-gray-600">
            TaskFlow helps teams organize tasks, collaborate in real time, and
            ship work faster without the chaos.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href={"/signup"}>
            <Button size="lg" className="gap-2 cursor-pointer">
                Start for free <ArrowRight className="h-4 w-4" />
            </Button>
            </Link>
            <Button size="lg" variant="outline" className="cursor-pointer">
              Watch demo
            </Button>
          </div>

          <div className="mt-10 text-sm text-gray-500">
            No credit card required • Free forever for small teams
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything you need to stay productive
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Designed for modern teams that value speed, clarity, and focus.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureList.map((f, idx) => (
              <Feature key={idx} desc={f.desc} icon={f.icon} title={f.title} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-16 text-3xl font-bold md:text-4xl">
            Get started in minutes
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {getStarted.map((s) => (
              <div key={s.step}>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Loved by teams worldwide
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <Testimonial
                key={idx}
                name={t.name}
                quote={t.quote}
                role={t.role}
                rating={t.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Ready to move faster?
          </h2>
          <p className="mb-10 text-gray-600">
            Join thousands of teams using TaskFlow today.
          </p>
          <Link href={"/signup"}>
          <Button size="lg" className="gap-2 cursor-pointer">
            Get started for free <ArrowRight className="h-4 w-4" />
          </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-gray-600 md:flex-row">
          <div className="font-semibold text-gray-900">© 2025 TaskFlow</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
