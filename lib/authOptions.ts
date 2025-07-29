import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null; // Only allow credentials login for user with password
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include role
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }: { token: unknown; user?: unknown }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = token as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u = user as Record<string, any>;
      if (u && u.role) {
        t.role = u.role;
      }
      return t;
    },
    async session({
      session,
      token,
    }: {
      session: import("next-auth").Session;
      token: import("next-auth/jwt").JWT;
    }) {
      if (session.user && token?.sub) {
        // Ambil user terbaru dari database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isPremium: true,
            emailVerified: true,
            createdAt: true,
            accounts: {
              select: {
                provider: true,
                providerAccountId: true,
                type: true,
              },
            },
          },
        });
        if (user) {
          session.user.id = user.id;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.image = user.image;
          session.user.role = user.role;
          session.user.isPremium = user.isPremium;
          session.user.emailVerified = user.emailVerified;
          session.user.createdAt = user.createdAt;
          session.user.accounts = user.accounts || [];
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({
      user,
      account,
    }: {
      user: import("next-auth").User;
      account: import("next-auth").Account | null;
    }) {
      // Hanya untuk login Google (atau OAuth lain), dan hanya jika emailVerified masih null
      if (
        account?.provider === "google" &&
        !(user as { emailVerified?: Date | null }).emailVerified
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
};
