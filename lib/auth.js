import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Invalid Credentials")
                }
                
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                })

                if (!user || !(credentials.password == user.password)) {
                    throw new Error("Invalid credentials")
                }

                return { id: user.id, username: user.username, role: user.role }
            }
        })
    ],
    callbacks: {
        session: async ({session, token}) => {
            if (session.user) {
                session.user.id  = token.id
                session.user.username = token.username
                session.user.role = token.role
            }
            return session
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.role = user.role
            }
            return token
        },
    },
    session: { strategy: "jwt", maxAge: 20*60 },
    secret: process.env.AUTH_SECRET
}

export const handler = NextAuth(authOptions)