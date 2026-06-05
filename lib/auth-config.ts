import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("[NextAuth] signIn START:", {
          email: user?.email,
          provider: account?.provider,
          userId: user?.id,
        });

        if (!user?.email) {
          console.error("[NextAuth] No email in signIn");
          return false;
        }

        // Ensure user exists in database
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
          },
          create: {
            email: user.email,
            name: user.name || "No Name",
            image: user.image || null,
          },
        });

        console.log("[NextAuth] signIn SUCCESS - User:", {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
        });

        return true;
      } catch (error) {
        console.error("[NextAuth] signIn ERROR:", {
          message: (error as Error).message,
          stack: (error as Error).stack,
        });
        return false;
      }
    },

    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          console.log("[NextAuth] jwt - user object:", { id: user.id, email: user.email });
        }

        // Get role from database
        if (token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            console.log("[NextAuth] jwt - db user found:", { id: dbUser.id, role: dbUser.role });
          } else {
            console.warn("[NextAuth] jwt - user not found in db:", token.email);
          }
        }
      } catch (error) {
        console.error("[NextAuth] jwt ERROR:", (error as Error).message);
      }
      return token;
    },

    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = (token.id as string) || "";
          session.user.role = (token.role as string) || "MAHASISWA";
          console.log("[NextAuth] session updated:", {
            email: session.user.email,
            id: session.user.id,
            role: session.user.role,
          });
        }
      } catch (error) {
        console.error("[NextAuth] session ERROR:", (error as Error).message);
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
