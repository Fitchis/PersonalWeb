import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isPremium?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
      emailVerified?: Date | null;
      accounts?: Array<{
        provider: string;
        providerAccountId: string;
        type: string;
      }>;
    };
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let notificationId: string | undefined;
  try {
    const body = await req.json();
    notificationId = body.notificationId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!notificationId || typeof notificationId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid notificationId" },
      { status: 400 }
    );
  }
  try {
    const notif = await prisma.notification.findUnique({
      where: { id: Number(notificationId) },
    });
    if (!notif || notif.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 }
      );
    }
    await prisma.notification.delete({ where: { id: Number(notificationId) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
