import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      isPremium?: boolean;
      emailVerified?: Date | null;
      createdAt?: Date;
      accounts?: Array<{
        provider: string;
        providerAccountId: string;
        type: string;
      }>;
    };
  }
}
