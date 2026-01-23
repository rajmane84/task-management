"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-neutral-800/50 font-sans selection:bg-red-500/30">
      {/* Navbar CONTAINER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl h-full px-6 py-12 md:px-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
