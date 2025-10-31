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
        const thumbnails =  res.thumbnail.thumbnails
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1)
        const stream = await db.stream.create({
            data: {
                userId : data.creatorId,
                url: data.url,
                extractedId, 
                type: "Youtube",
                title: res.title ?? "Cant find video",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://imgs.search.brave.com/QpSeSwiufBTr4QlTzZrh9lSQW2HmMxceS0avU2ZhVX8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vTUFER3h2/SE1JQjAvNC90aHVt/Ym5haWxfbGFyZ2Uv/Y2FudmEtY2xvc2Ut/dXAtcGhvdG8tb2Yt/YS1mdW5ueS1jYXQt/TUFER3h2SE1JQjAu/anBn",
                smallImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "https://imgs.search.brave.com/QpSeSwiufBTr4QlTzZrh9lSQW2HmMxceS0avU2ZhVX8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vTUFER3h2/SE1JQjAvNC90aHVt/Ym5haWxfbGFyZ2Uv/Y2FudmEtY2xvc2Ut/dXAtcGhvdG8tb2Yt/YS1mdW5ueS1jYXQt/TUFER3h2SE1JQjAu/anBn" 
            }
        });
        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0,
            message: "Added stream",   
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message: "Error while adding a stream",

        }, {
            status: 411
        })
    }
    
}


export async function GET(req: NextRequest) {
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