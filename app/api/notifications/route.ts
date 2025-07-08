import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return NextResponse.json({ count: 0 });
  }

  // Query unread notifications for this user
  const count = await prisma.notification.count({
    where: { userId, read: false },
  });
  return NextResponse.json({ count });
}

// Add notification for current user
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { message, type, link } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  const notif = await prisma.notification.create({
    data: {
      userId,
      message,
      type: type || "info",
      link: link || null,
      read: false,
    },
  });
  return NextResponse.json({ notification: notif });
}
