import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ConnectGithubPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/auth/signin?error=not_authenticated");
  }

  // Cari akun GitHub yang baru saja login (dari Account table)
  // Cari berdasarkan provider = 'github' dan userId = user yang sedang login
  // Jika sudah terhubung, tampilkan pesan sukses
  // Jika belum, tampilkan error atau info
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true },
  });

  const githubAccount = user?.accounts.find((acc) => acc.provider === "github");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Connect with GitHub
        </h1>
        {githubAccount ? (
          <div className="text-green-400 font-semibold">
            GitHub account is now linked to your profile!
          </div>
        ) : (
          <div className="text-yellow-400 font-semibold">
            GitHub account not linked. Please try again or contact support.
          </div>
        )}
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
