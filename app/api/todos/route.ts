import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Get all todos milik user login
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json([], { status: 401 });
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(todos);
}

// Add new todo (hanya untuk user login)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { text, deadline } = await req.json();
  if (!text)
    return NextResponse.json({ error: "Text required" }, { status: 400 });
  let deadlineDate: Date | null | undefined = undefined;
  if (deadline !== undefined) {
    if (deadline === null) deadlineDate = null;
    else {
      const d = new Date(deadline);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Invalid deadline" },
          { status: 400 }
        );
      }

      const now = new Date();
      if (d.getTime() < now.getTime() - 60000) {
        // beri toleransi 1 menit
        return NextResponse.json(
          { error: "Time traveler kah maniz?" },
          { status: 400 }
        );
      }
      deadlineDate = d;
    }
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Cari order terbesar milik user
  const maxOrderTodo = await prisma.todo.findFirst({
    where: { userId: user.id },
    orderBy: { order: "desc" },
  });
  const nextOrder = maxOrderTodo ? maxOrderTodo.order + 1 : 1;
  const todo = await prisma.todo.create({
    data: {
      text,
      userId: user.id,
      order: nextOrder,
      ...(deadlineDate !== undefined ? { deadline: deadlineDate } : {}),
    },
  });
  return NextResponse.json(todo, { status: 201 });
}

// Reorder todos (drag & drop)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Ambil semua todo milik user
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
  });
  // Validasi semua id milik user
  const userTodoIds = new Set(todos.map((t) => t.id));
  if (!order.every((id) => userTodoIds.has(id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Update order satu per satu
  await Promise.all(
    order.map((id, idx) =>
      prisma.todo.update({ where: { id }, data: { order: idx + 1 } })
    )
  );
  return NextResponse.json({ success: true });
}

// Update todo (done status, hanya milik user login)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, done, deadline } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Pastikan todo milik user
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let deadlineDate2: Date | null | undefined = undefined;
  if (deadline !== undefined) {
    if (deadline === null) deadlineDate2 = null;
    else {
      const d = new Date(deadline);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Invalid deadline" },
          { status: 400 }
        );
      }
      deadlineDate2 = d;
    }
  }
  const updated = await prisma.todo.update({
    where: { id },
    data: {
      ...(done !== undefined ? { done } : {}),
      ...(deadline !== undefined ? { deadline: deadlineDate2 } : {}),
    },
  });
  return NextResponse.json(updated);
}

// Delete todo (single/multiple, hanya milik user login)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const ids: number[] = body.ids || (body.id !== undefined ? [body.id] : []);
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No id(s) provided" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Validasi semua todo milik user
  const todos = await prisma.todo.findMany({ where: { id: { in: ids } } });
  if (todos.some((t) => t.userId !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.todo.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ success: true });
}
