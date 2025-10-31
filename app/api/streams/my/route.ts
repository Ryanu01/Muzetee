import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db"
export async function GET(req: NextRequest) {
    const session = await getServerSession(authConfig);

    const user = await db.user.findFirst({
        where: {
            id: session?.user.uid
        }
    })

    if(!user) {
        return NextResponse.json({
            message: "User Not Found"
        }, {
            status: 403
        })
    }

    const streams = await db.stream.findMany({
        where: {
            userId: user.id
        }, include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    })

    if(!streams) {
        return NextResponse.json({
            message: "Unable to fetch streams for the user",
            user
        }, {
            status: 400
        })
    }

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes
        }))
    })
}