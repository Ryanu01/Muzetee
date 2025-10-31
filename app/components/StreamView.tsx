"use client"

var YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;


import { toast, ToastContainer } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronUp, ChevronDown, ThumbsDown, Play, Share2, Axis3DIcon } from "lucide-react"
import 'react-toastify/dist/ReactToastify.css'
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import YouTubePlayer from "youtube-player";
import { signIn, signOut, useSession } from 'next-auth/react'
import { Redirect } from './Redirect'

interface Video {
    "id": string,
    "type": string,
    'url': string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "upvotes": number,
    "haveUpvoted": boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string,
    playVideo: boolean
}) {
    const [inputLink, setInputLink] = useState('');
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false);
    const videoPlayerRef = useRef<HTMLDivElement>(null);


    async function refreshStreams() {
        const res = await axios.get('/api/streams/my', {
            withCredentials: true
        })
        
        const json = await res.data;
        setQueue(json.streams.sort((a: any, b: any) => a.upvotes < b.upvotes ? 1 : -1));
        
        console.log(res.data);
        
        console.log(json.streams.id);
        setCurrentVideo(video => {
            console.log("1 ",video);
            
            if (video?.id === json.streams[0].id) {
                return video;
            }
            return json.streams[0];
        })
    }

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
        }, REFRESH_INTERVAL_MS)
        return () => clearInterval(interval);
    }, [])


    useEffect(() => {
        if (!videoPlayerRef.current) {
            return;
        }
        let player = YouTubePlayer(videoPlayerRef.current);
        if (!currentVideo?.extractedId) {
            return;
        }
        player.loadVideoById(currentVideo?.extractedId);

        player.playVideo();
        function eventHandler(event: any) {
            console.log(event);
            console.log((event.data));
            if (event.data === 0) {
                playNext();
            }
        };

        player.on('stateChange', eventHandler);
        return () => {
            player.destroy();
        }
    }, [currentVideo, videoPlayerRef])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await axios.post("api/streams", {
            creatorId,
            url: inputLink
        })

        setQueue([...queue, await res.data])
        setLoading(false);
        setInputLink("");
    }


    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(queue.map(video => video.id === id ? {
            ...video,
            upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
            haveUpvoted: !video.haveUpvoted
        } : video
        ).sort((a, b) => (b.upvotes) - (a.upvotes)))

        axios.post(`api/streams/${isUpvote ? "upvote" : "downvote"}`, {
            streamId: id
        })

    }

    const playNext = async () => {
        if (queue.length > 0) {
            try {
                setPlayNextLoader(true)
                const data = await axios.get('api/streams/')
                const json = await data.data;
                setCurrentVideo(json.streams);
                setQueue(q => q.filter(x => x.id !== json.stream?.id))
            } catch (error) {
                console.log(error);
            }
            setPlayNextLoader(false);
        }
    }


    console.log("HERE",currentVideo?.url);
    
    const session = useSession();
    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
            <div>
                <div className="flex justify-between">
                    <div className=" px-4 p-5 mb-12">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 mb-2">
                            Muzetee
                        </h1>
                        <p className="text-slate-400">Help choose the next song to stream</p>
                    </div>
                    <div>
                        {session.data?.user && <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer" onClick={() => signOut()} >
                            logout
                        </button>}
                        {!session.data?.user && <button onClick={() => signIn()} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer">
                            singIn
                        </button>}
                        <Redirect />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* === Left Side: Player + Form === */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Player Section */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
                            <iframe
        className="w-full h-full"
        src={`https://youtube.com/embed/${currentVideo?.extractedId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        
      />
                        </div>

                        {/* Add Song Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-3 bg-slate-800/40 border border-slate-700 p-4 rounded-xl backdrop-blur-md"
                        >
                            <input
                                type="url"
                                required
                                value={inputLink}
                                onChange={(e) => setInputLink(e.target.value)}
                                placeholder="Enter YouTube link..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </form>
                    </div>

                    {/* === Right Side: Queue === */}
                    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Up Next</h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {queue.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No songs in queue</p>
                            ) : (
                                queue.map((video) => (
                                    <div
                                        key={video.id}
                                        className="flex justify-between items-center bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:bg-slate-800/50 transition"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{video.title}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVote(video.id, true)}
                                                className={`px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-700 transition ${video.haveUpvoted ? "text-green-400" : "text-slate-300"
                                                    }`}
                                            >
                                                ▲ {video.upvotes}
                                            </button>
                                            <button
                                                onClick={() => handleVote(video.id, false)}
                                                className="px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-700 transition text-red-400"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Play Next */}
                        {playVideo && (
                            <button
                                onClick={playNext}
                                disabled={playNextLoader}
                                className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50"
                            >
                                {playNextLoader ? "Loading..." : "Play Next"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

