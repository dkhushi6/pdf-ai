import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
}
