"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import ThemeSwitcher from "./theme/theme-switcher";
import { MessageSquare, LogIn, LogOut, FileText } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg text-primary"
      >
        <FileText className="w-5 h-5" />
        PDF-AI
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme switcher */}
        <ThemeSwitcher />

        {/* Show New Chat only if logged in */}
        {session?.user?.id && (
          <Link
            href="/chat/new"
            className={buttonVariants({ variant: "outline" })}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            New Chat
          </Link>
        )}

        {/* Auth Section */}
        {session?.user?.id ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Image
                alt="user-image"
                src={session.user.image || "/default-avatar.png"}
                width={36}
                height={36}
                className="rounded-full cursor-pointer border"
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-40">
              <p className="mb-2 text-sm font-medium text-center">
                {session.user.name}
              </p>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "default" })}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
