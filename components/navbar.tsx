"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between border p-2">
      <div>PDF-AI</div>
      <div>
        {session?.user?.id ? (
          <div>
            <HoverCard>
              <HoverCardTrigger>
                <Image
                  alt="user-image"
                  src={session.user.image || "default.jpg"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </HoverCardTrigger>
              <HoverCardContent>
                <Button variant="ghost" onClick={() => signOut()}>
                  LogOut
                </Button>
              </HoverCardContent>
            </HoverCard>
          </div>
        ) : (
          <div>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
