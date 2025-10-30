import { authConfig } from "@/app/lib/auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth(authConfig)


export {handler as GET, handler as POST}