"use client"

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Real-Time Voting",
      description: "Instant vote tallying and automatic song switching",
    },
    {
      icon: "👥",
      title: "Engage Your Audience",
      description: "Build deeper connections with interactive music control",
    },
    {
      icon: "🎵",
      title: "Spotify Integration",
      description: "Connect your favorite music streaming service seamlessly",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track voting trends and audience preferences over time",
    },
    {
      icon: "🎬",
      title: "Multi-Platform",
      description: "Works with Twitch, YouTube, and custom streaming platforms",
    },
    {
      icon: "🔐",
      title: "Moderation Tools",
      description: "Keep your streams safe with content controls",
    },
  ]

  return (
    <section id="features" className="py-20 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Powerful Features</h2>
          <p className="text-foreground/70 text-lg">Everything you need for engaging interactive streams</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-card/50 border border-border rounded-lg p-6 hover:border-primary/50 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
