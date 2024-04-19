import prisma from '@/lib/prismadb';
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from 'bcrypt';
import NextAuth, { Session } from "next-auth";
import { JWT } from 'next-auth/jwt';
import credentials from 'next-auth/providers/credentials';
import { NextRequest } from 'next/server';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    credentials({
      name: 'credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toString()
          }
        })

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials")
        }

        const isCorrect = await bcrypt.compare(credentials.password.toString(), user.hashedPassword);

        if (!isCorrect) {
          throw new Error("Invalid Credentials");
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }

      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: 'jwt'
  }
})