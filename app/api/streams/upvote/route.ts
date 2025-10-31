import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db"
import z, { string } from "zod";
const UpvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST (req: NextRequest) {
    const session = await getServerSession(authConfig)

    if(!session?.user?.uid) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    const user = await db.user.findFirst({
        where: {
            id: session.user.uid
        }
    })
    if(!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }
    try {
        const data = UpvoteSchema.parse(await req.json());
        await db.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
        return NextResponse.json({
            message: "Done"
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 403
        })
    }
        
}