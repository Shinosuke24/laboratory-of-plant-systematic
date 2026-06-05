import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // Create user if it does not exist yet
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "No Name",
              },
            });
          }

          token.id = dbUser.id;
          token.role = dbUser.role;
        } catch (error) {
          // Fallback if database is unavailable
          console.log("[v0] Database unavailable, using fallback auth");
          token.id = user.email || "unknown";
          token.role = "USER";
        }
      }

      // Refresh role on each request (with fallback)
      if (token.email && !token.databaseFailed) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          // Mark that database failed to avoid repeated attempts
          token.databaseFailed = true;
          console.log("[v0] Database error on session refresh, keeping cached role");
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || session.user.email || "unknown";
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
