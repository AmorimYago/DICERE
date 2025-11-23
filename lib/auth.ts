// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email ou Nome", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        const identifier = credentials.identifier.trim()

        // Se for email, autentica como pai/cuidador
        if (identifier.includes("@")) {
          const user = await prisma.user.findUnique({
            where: { email: identifier }
          })

          if (!user || !user.password) return null

          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null

          return {
            id: user.id,
            name: user.name ?? undefined,
            email: user.email,
            role: user.role ?? "PAI"
          } as any
        }

        // Senão, autentica como criança
        const child = await prisma.child.findFirst({
          where: { name: identifier }
        })

        if (!child || !child.password) return null

        const valid = await bcrypt.compare(credentials.password, child.password)
        if (!valid) return null

        // Busca o pai/cuidador vinculado
        const childAccess = await prisma.childAccess.findFirst({
          where: { childId: child.id }
        })

        return {
          id: child.id,
          name: child.name,
          email: undefined,
          role: "CRIANCA",
          parentId: childAccess?.userId // id do pai/cuidador vinculado
        } as any
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = (user as any).role
        token.parentId = (user as any).parentId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).parentId = token.parentId as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}