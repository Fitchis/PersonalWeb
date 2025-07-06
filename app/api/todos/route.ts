import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get all todos
export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(todos);
}

// Add new todo
export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text)
    return NextResponse.json({ error: "Text required" }, { status: 400 });
  const todo = await prisma.todo.create({ data: { text } });
  return NextResponse.json(todo, { status: 201 });
}

// Update todo (done status)
export async function PATCH(req: NextRequest) {
  const { id, done } = await req.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: { done },
  });
  return NextResponse.json(todo);
}

// Delete todo
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
