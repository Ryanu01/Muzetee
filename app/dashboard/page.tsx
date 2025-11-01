"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Redirect } from "../components/Redirect"
import axios from "axios"
import StreamView from "../components/StreamView"
const REFRESH_INTERVAL_MS = 10 * 1000;
export default function Home() {    
    return <StreamView creatorId="51ef098d-b198-4323-86e6-526437e8bc61" playVideo={true} />
}
