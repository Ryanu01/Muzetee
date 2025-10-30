import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";
import db from "../../lib/db"
const YT_REGEX = new RegExp("^https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$");
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST (req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt) {
            return NextResponse.json({
                message: "Wrong url"
            }, {
                status: 400
            })
        }

        const extractedId = data.url.split("?v=")[1]
        await db.stream.create({
            data: {
                userId : data.creatorId,
                url: data.url,
                extractedId, 
                type: "Youtube",
            }
        });
        return NextResponse.json({
            message: `Success data extracted the id is ${extractedId}`
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