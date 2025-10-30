import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";
import db from "../../lib/db"
import youtubesearchapi from "youtube-search-api";

var YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST (req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        
        if(!isYt) {
            return NextResponse.json({
                message: "Wrong url",
                isYt
            }, {
                status: 400
            })
        }

        const extractedId = data.url.split("?v=")[1]
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log("The title is", res.title);
        console.log(res.thumbnail.thumbnails[4].url);

        
        const stream = await db.stream.create({
            data: {
                userId : data.creatorId,
                url: data.url,
                extractedId, 
                type: "Youtube",
            }
        });
        return NextResponse.json({
            message: "Added stream",
            id: stream.id
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
    
}


async function GET(req: NextRequest) {
    const createId = req.nextUrl.searchParams.get("creatorId");

    const streams = await db.stream.findMany({
        where: {
            userId: createId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}