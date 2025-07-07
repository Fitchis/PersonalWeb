import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, password, image } = await req.json();
  if (!name && !password && !image) {
    return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );
  const data: { name?: string; password?: string; image?: string } = {};
  if (name) data.name = name;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (typeof image === "string") data.image = image;
  await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({ success: true });
}
