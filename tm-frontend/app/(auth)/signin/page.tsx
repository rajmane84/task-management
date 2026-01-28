"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { loginSchema, type LoginInput } from "@/lib/schema/login.schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";
import { AtlassianLogo, TaskFlowLogo } from "@/components/logo";
import { loginUser } from "@/services/auth.service";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

const onSubmit = async (data: LoginInput) => {
      const response = await loginUser(data);
      if (!response) return;

      const { user } = response.data.data;
      console.log("user", user);

      toast.success(`Welcome back, ${user.name}!`);

      startTransition(() => {
        setUser({
          name: user.name || "",
          email: user.email || "",
          username: user.username || "",
        });
        router.replace("/app");
      });
  };


  const inputBaseStyles =
    "w-full p-2 border outline-none text-neutral-800 focus:ring-2 focus:ring-blue-500 bg-neutral-100/50 transition-all duration-300 placeholder:text-gray-500";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-500 to-blue-400 p-4 font-sans">
      <div className="mb-8 flex items-center gap-2 text-white">
        <TaskFlowLogo />
        <span className="text-3xl font-bold tracking-tight text-white">
          TaskFlow
        </span>
      </div>

      <div className="w-full max-w-100 rounded-sm bg-white p-8 text-center shadow-xl">
        <h2 className="mb-6 font-semibold text-[#5e6c84]">
          Log in to TaskFlow
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              placeholder="Enter email"
              type="email"
              className={cn(
                inputBaseStyles,
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300",
              )}
            />
            {errors.email && (
              <p className="mt-1 text-left text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                {...register("password")}
                type={isPasswordVisible ? "text" : "password"}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                placeholder="Enter password"
                className={cn(
                  inputBaseStyles,
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300",
                )}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-left text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center rounded-sm bg-green-500 py-2 font-bold text-white transition-colors hover:bg-green-600",
              isPending && "cursor-not-allowed opacity-70",
            )}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 font-medium text-gray-500">OR</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => alert("This feature will be available soon!!")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-300 p-2 font-semibold text-[#42526e] transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>
          <button
            onClick={() => alert("This feature will be available soon!!")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-300 p-2 font-semibold text-[#42526e] transition-colors hover:bg-gray-50"
          >
            <AtlassianLogo />
            Continue with Atlassian
          </button>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="flex justify-center text-sm font-medium">
          <Link href="/signup" className="text-[#0052cc] hover:underline">
            New here? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
