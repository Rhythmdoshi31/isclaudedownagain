"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data.status);
      } catch {
        setStatus("unknown");
      }
    };
    fetchStatus();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white p-4 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter bg-yellow text-black px-4 py-1.5 rounded-full hover:-translate-y-0.5 transition-all flex items-center">
          kyabeclau.de
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/#how-it-works" className="text-sm font-bold bg-white text-black px-4 py-1.5 rounded-full hover:bg-yellow hover:-translate-y-0.5 transition-all hidden sm:block">
            how it works
          </Link>
          <div className="bg-white text-black px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold border-2 border-transparent relative overflow-hidden group">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]",
                status === "operational" && "bg-green",
                status === "degraded" && "bg-orange",
                status === "outage" && "bg-red",
                status === "checking..." && "bg-gray-400 animate-pulse",
                status === "unknown" && "bg-gray-400"
              )}
            ></span>
            <span className="uppercase tracking-wider text-xs">{status}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
