import { Metadata } from "next";

export const metadata: Metadata = {
  title: "claude outage history",
};

export default function HistoryPage() {
  return (
    <main className="flex-1 bg-yellow flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 flex flex-wrap gap-2 items-center justify-center text-center">
          <span className="text-black drop-shadow-[4px_4px_0_rgba(255,255,255,1)]">incident</span>
          <span className="text-white bg-black px-2 y2k-border -rotate-2">history</span>
        </h1>
        
        <div className="y2k-card bg-white p-12 text-center relative max-w-xl mx-auto y2k-shadow">
          <div className="absolute -top-6 -left-6 text-5xl text-black/10 -rotate-12">★</div>
          <div className="absolute -bottom-6 -right-6 text-5xl text-black/10 rotate-12">★</div>
          
          <h2 className="text-2xl font-bold mb-4">no incidents yet</h2>
          <p className="text-gray-600 font-bold">claude has been running smoothly. check back later if anything goes wrong.</p>
        </div>
      </div>
    </main>
  );
}
