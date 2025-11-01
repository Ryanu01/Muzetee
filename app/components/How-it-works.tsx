"use client"

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Creator Goes Live",
      description: "Start your broadcast and enable music voting",
    },
    {
      number: "2",
      title: "Fans Vote on Songs",
      description: "Viewers instantly vote on their favorite tracks from the queue",
    },
    {
      number: "3",
      title: "Top Voted Plays",
      description: "The most voted song plays automatically in real-time",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">How It Works</h2>
          <p className="text-foreground/70 text-lg">Simple, engaging, and designed for real-time interaction</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                <span className="text-primary-foreground font-bold text-lg">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
