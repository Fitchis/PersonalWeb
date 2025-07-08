import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // @ts-expect-error - id is injected in session.user by session callback
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = await req.json();
  if (!notificationId) {
    return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
  }

  const notif = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notif) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
