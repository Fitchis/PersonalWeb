import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    (session.user as { role?: string }).role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { ids, message } = await req.json();
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    // Example: Save notifications to a Notification table (create if not exists)
    // You may want to send emails or push notifications here as well
    // For now, just store in DB (assuming Notification model exists)
    const notifications = await Promise.all(
      ids.map((userId: string) =>
        prisma.notification.create({
          data: {
            userId,
            message,
            // sentBy: session.user.email || "admin", // Removed because 'sentBy' is not a valid property
          },
        })
      )
    );
    return NextResponse.json({ success: true, count: notifications.length });
  } catch (err) {
    console.error("Notification error:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
