import { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/lib/db"

export interface session extends Session {
    user: {
        email: string,
        name: string,
        image: string,
        uid: string
    }
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET ?? "",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ], 
    callbacks: {
        session: ({session, token}: any): session => {
            const newSession = session as session
            if(newSession.user && token.uid) {
                newSession.user.uid = token.uid as string
            }
            return newSession
        },
        async jwt({token, account, profile}: any) {
            // Only query DB when account exists (on sign in)
            if(account) {
                const user = await db.user.findFirst({
                    where: {
                        sub: account.providerAccountId
                    }
                }) 
                if(user) {
                    token.uid = user.id
                }
            }
            return token
        },
        async signIn({ user, account, profile }: any) {
            if(account?.provider === "google") {
                const email = user.email;
                if(!email) {
                    return false
                }
                
                const userDb = await db.user.findFirst({
                    where: {
                        email: email
                    }
                })

                if(userDb) {
                    return true
                }

                await db.user.create({
                    data: {
                        email: email,
                        sub: account?.providerAccountId,
                        provider: "Google"
                    }
                })
                return true
            }
            return false
        }
    }
}