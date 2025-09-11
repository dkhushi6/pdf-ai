"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { LucideMoon, LucideSun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="transition-all"
    >
      <LucideSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <LucideMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
