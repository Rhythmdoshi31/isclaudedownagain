import { Metadata } from "next";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "is claude down again?",
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <HowItWorks />
    </main>
  );
}
