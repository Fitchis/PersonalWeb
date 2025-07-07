import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Get all job applications milik user login
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json([], { status: 401 });
  const jobs = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(jobs);
}

// Add new job application (hanya untuk user login)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { company, position, status } = await req.json();
  if (!company || !position) {
    return NextResponse.json(
      { error: "Company and position required" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.jobApplication.create({
    data: {
      company,
      position,
      status: status || "pending",
      userId: user.id,
    },
  });
  return NextResponse.json(job, { status: 201 });
}

// Update job application status (hanya milik user login)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, status } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.jobApplication.findUnique({ where: { id } });
  if (!job || job.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await prisma.jobApplication.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(updated);
}

// Delete job application (hanya milik user login)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.jobApplication.findUnique({ where: { id } });
  if (!job || job.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
