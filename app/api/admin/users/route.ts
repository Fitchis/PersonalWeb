import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    (session.user as { role?: string }).role !== "ADMIN"
  ) {
    // Optionally log unauthorized access attempts
    console.warn(
      `Unauthorized admin API access attempt at ${new Date().toISOString()} from user:`,
      session?.user?.email || "unknown"
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    (session.user as { role?: string }).role !== "ADMIN"
  ) {
    console.warn(
      `Unauthorized admin API DELETE attempt at ${new Date().toISOString()} from user:`,
      session?.user?.email || "unknown"
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No user IDs provided" },
        { status: 400 }
      );
    }
    // Prevent self-deletion
    const adminEmail = session.user.email;
    const usersToDelete = await prisma.user.findMany({
      where: { id: { in: ids } },
    });
    if (usersToDelete.some((u) => u.email === adminEmail)) {
      return NextResponse.json(
        { error: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bulk delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
