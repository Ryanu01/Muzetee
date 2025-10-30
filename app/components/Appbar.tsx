"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function Appbar () {
    const session = useSession()
    return (
        <div className="flex justify-between border ">
            <div className="m-2 p-2 flex justify-center text-3xl font-bold text-slate-500">
                Muzete
            </div>
            <div>
                {session.data?.user && <button  className="flex-wrap gap-4 items-center hover:bg-blue-500 bg-blue-200 m-3 p-2 flex flex-col justify-center" onClick={() => signOut()} >
                    logout
                </button>}
                {!session.data?.user && <button onClick={() => signIn()} className="flex-wrap gap-4 items-center bg-blue-500 m-3 p-2 flex flex-col justify-center">
                    singIn
                </button>}
            </div>
        </div>
    )
}