import { prisma } from "@/lib/prisma";

// This script creates a test notification for a user. Adjust userId as needed.
export async function POST(request: Request) {
  const { userId, message } = await request.json();
  if (!userId || !message) {
    return new Response(
      JSON.stringify({ error: "Missing userId or message" }),
      { status: 400 }
    );
  }
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      read: false,
    },
  });
  return new Response(JSON.stringify(notification), { status: 201 });
}
