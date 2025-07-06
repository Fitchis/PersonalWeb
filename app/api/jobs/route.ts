import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get all job applications
export async function GET() {
  const jobs = await prisma.jobApplication.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(jobs);
}

// Add new job application
export async function POST(req: NextRequest) {
  const { company, position, status } = await req.json();
  if (!company || !position) {
    return NextResponse.json(
      { error: "Company and position required" },
      { status: 400 }
    );
  }

  const job = await prisma.jobApplication.create({
    data: {
      company,
      position,
      status: status || "pending",
    },
  });
  return NextResponse.json(job, { status: 201 });
}

// Update job application status
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const job = await prisma.jobApplication.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(job);
}

// Delete job application
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
