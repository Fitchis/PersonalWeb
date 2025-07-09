import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

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

  // Create user with emailVerified: null
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, emailVerified: null },
  });

  // Generate verification token
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, token);

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
    message: "Please check your email to verify your account.",
  });
}
