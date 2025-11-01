import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import db from "@/app/lib/db" 
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authConfig);

    const user = await db.user.findFirst({
        where: {
            id: session?.user.uid
        }
    });

    if(!user) {
        return NextResponse.json({
            message: "Unauthorizead"
        }, {
            status: 403
        })
    }

    const mostUpvotedStream = await db.stream.findFirst({
        where: {
            userId: user.id,
            played: false
        },
        orderBy: {
            upvotes: {
                _count: "desc"
            }
        }
    });
    if(!mostUpvotedStream) {
        return NextResponse.json({
            message: "No Streams"
        }, {
            status: 411
        })
    }

    await  Promise.all([db.currentStream.upsert({
        where: {
            userId: user.id
        }, update: {
            streamId: mostUpvotedStream?.id
        }, create: {
            userId: user.id,
            streamId: mostUpvotedStream?.id
        }
    }), ( async () => {
            await db.upvote.deleteMany({
                where: {
                    streamId: mostUpvotedStream?.id
                }
            });
            await db.stream.update({
                where: {
                    id: mostUpvotedStream?.id
                }, data: {
                    played: true,
                    playedTs: new Date()
                }
            });
        })()
    ])
    
    return NextResponse.json({
        stream: mostUpvotedStream
    })
}