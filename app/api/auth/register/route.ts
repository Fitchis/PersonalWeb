import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json(
      { error: "Email sudah terdaftar" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
