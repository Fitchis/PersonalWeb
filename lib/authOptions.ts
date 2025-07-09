import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
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
        if (!user) return null;
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
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: import("next-auth/jwt").JWT;
      user?: (
        | import("next-auth").User
        | import("next-auth/adapters").AdapterUser
      ) & { role?: string };
      account?: import("next-auth").Account | null;
      profile?: import("next-auth").Profile;
      isNewUser?: boolean;
      trigger?: "signIn" | "signUp" | "update";
      session?: import("next-auth").Session;
    }) {
      if (user && user.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: import("next-auth").Session;
      token: import("next-auth/jwt").JWT;
    }) {
      // For JWT strategy, id is on token
      if (session.user && token?.sub) {
        (session.user as { id?: string | undefined } & typeof session.user).id =
          token.sub;
      }
      // Add role to session.user
      if (session.user && token?.role) {
        (
          session.user as { role?: string | undefined } & typeof session.user
        ).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
