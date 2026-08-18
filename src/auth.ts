import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/db"
import connectToDatabase from "./lib/mongodb"
import User from "./models/User"
import { verifyPassword } from "./lib/password"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        // 1. Check for Superadmin configured in .env
        const superadminEmail = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
        const superadminPassword = process.env.SUPERADMIN_PASSWORD;

        if (superadminEmail && superadminPassword && email === superadminEmail && password === superadminPassword) {
          return {
            id: "superadmin_root",
            name: "Super Admin",
            email: superadminEmail,
            role: "superadmin",
          };
        }

        // 2. Check MongoDB User collection
        try {
          await connectToDatabase();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          // If user has a password set, verify it
          if (user.password) {
            const isValid = verifyPassword(password, user.password);
            if (!isValid) {
              return null;
            }
          } else {
            // User registered without password (e.g. OAuth), require password set
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        (session.user as any).role = token.role || "user";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
})
