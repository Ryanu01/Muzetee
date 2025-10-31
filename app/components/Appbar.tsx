"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function Appbar () {
    const session = useSession()
    return (
        <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">♫</span>
          </div>
          <span className="text-xl font-bold text-foreground">Muzetee</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground/70 hover:text-foreground transition">
            Features
          </a>
          <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition">
            How it works
          </a>
          <a href="#cta" className="text-foreground/70 hover:text-foreground transition">
            Pricing
          </a>
        </div>
        <div>
            {session.data?.user && <button  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer" onClick={() => signOut()} >
                logout
            </button>}
            {!session.data?.user && <button onClick={() => signIn()} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer">
                singIn
        </button>}
            </div>
      </div>
    </nav>
    )
}



