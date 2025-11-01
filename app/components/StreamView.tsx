"use client"

var YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;

import { toast, ToastContainer } from 'react-toastify'
import { CircleChevronUp, CircleChevronDown, ChevronDown, ThumbsDown, Play, Share2, Axis3DIcon, ChevronUp, LogOut } from "lucide-react"
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import YouTubePlayer from "youtube-player";
import { signIn, signOut, useSession } from 'next-auth/react'
import { Redirect } from './Redirect'
import { Button } from '@/components/ui/button';

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

const REFRESH_INTERVAL_MS = 5 * 1000;

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
    try {
            console.log("Creator ID:", creatorId); // Add this
            const res = await axios.get(`/api/streams/?creatorId=${creatorId}`, {
                withCredentials: true
            });
            
            const { streams } = res.data;
            
            if (!streams || streams.length === 0) {
                console.log("No streams available");
                    setQueue([]);
                    setCurrentVideo(null);
                    return;
            }
            
            const sortedStreams = streams.sort((a: any, b: any) => b.upvotes - a.upvotes);
            setQueue(sortedStreams);
            
            console.log("Streams:", streams);
            console.log("First stream ID:", streams[0]?.id);
            
            setCurrentVideo(video => {
                if (video?.id === sortedStreams[0].id) {
                    return video; 
                }
                return sortedStreams[0];
            });
        } catch (error) {
            console.error("Error refreshing streams:", error);
        }
    }
    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, REFRESH_INTERVAL_MS)
        console.log(interval);
        
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

        console.log("input link ", inputLink);
        
        setQueue([...queue, await res.data])
        console.log(queue);
        
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

    

        const handleShare = () => {
        const shareableLink = `${window.location.hostname}/creator/${creatorId}`
        navigator.clipboard.writeText(shareableLink).then(() => {
        toast.success('Link copied to clipboard!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        }, (err) => {
        console.error('Could not copy text: ', err)
        toast.error('Failed to copy link. Please try again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        })
    }

    console.log("HERE",currentVideo?.url);
    
    
    const session = useSession();
    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
            <div>
                <div className="px-4 p-5 flex justify-between">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 mb-2">
                            Muzetee
                        </h1>
                        <p className="text-slate-400">Help choose the next song to stream</p>
                    </div>
                    <div>
                        <div className="flex">

                        
                        <div className="flex px-7">
                            <button onClick={handleShare} className="cursor-pointer">
                            <Share2 />
                            </button>
                        </div>
                        
                        {session.data?.user && <button className="cursor-pointer" onClick={() => signOut()} >

                        <LogOut></LogOut>
                        </button>}
                        {!session.data?.user && <button onClick={() => signIn()} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer">
                            singIn
                        </button>}
                        <Redirect />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* === Left Side: Player + Form === */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Player Section */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
                            <iframe
                                className="w-full"
                                src={`https://youtube.com/embed/${currentVideo?.extractedId}`}
                                width={200}
                                height={450}
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
                                            <div>
                                                <img src={video.smallImg} width={200} height={120} alt="No image" />
                                            </div>
                                            <div>
                                                <span className="font-medium">{video.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVote(video.id, true)}
                                                disabled={video.haveUpvoted}
                                                className={`px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-700 transition ${video.haveUpvoted ? "text-green-400" : "text-slate-300"
                                                    } ${video.haveUpvoted ? "opacity-50 cursor-not-allowed": ""}`}
                                            >
                                                <CircleChevronUp> 
                                                </CircleChevronUp>
                                                    {video.upvotes}
                                            </button>
                                            <button
                                                onClick={() => handleVote(video.id, false)}
                                                disabled={!video.haveUpvoted}
                                                className={`px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-700 transition ${!video.haveUpvoted ? "text-red-400" : "text-slate-300"} ${video.haveUpvoted === false ? "opacity-50 cursor-not-allowed": ""}`}
                                            >
                                                <CircleChevronDown>
                                                
                                                </CircleChevronDown>
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
                 <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </main>
    )
}

