"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashHero() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center  px-4">
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 rounded-full bg-muted">
          <BookOpen className="w-16 h-16 text-primary" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        PDF<span className="text-primary">-AI</span>
      </h1>

      {/* Quote */}
      <p className="mt-4 text-lg md:text-xl text-muted-foreground  max-w-xl">
        “Turn your PDFs into conversations. Ask, explore, and discover insights
        instantly.”
      </p>

      <Button
        size="lg"
        className="mt-8 px-8 py-6 text-lg rounded-xl shadow-md hover:scale-105 transition"
        onClick={() => router.push("/chat")}
      >
        <LucidePlus />
        Start Conversation
      </Button>
    </div>
  );
}
