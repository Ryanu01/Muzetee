"use client"
import Image from "next/image";
export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
          <span className="text-primary text-sm font-medium">The future of live streaming</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
          Let Your Fans <span className="text-primary">Choose the Music</span>
        </h1>

        <p className="text-xl text-foreground/70 mb-8 text-balance max-w-2xl mx-auto">
          Empower your audience to shape your stream. Real-time voting, instant gratification, and deeper fan engagement
          all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition text-lg">
            Start Broadcasting
          </button>
          <button className="bg-card border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-card/80 transition text-lg">
            Watch a Stream
          </button>
        </div>

        <div className="mt-16 relative">
          <div className="bg-linear-to-b from-primary/20 to-transparent absolute inset-0 blur-3xl"></div>
          
        </div>
      </div>
    </section>
  )
}
