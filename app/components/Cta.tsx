"use client"
export default function CTA() {
  return (
    <section id="cta" className="py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto bg-card border border-primary/30 rounded-2xl p-12 md:p-16 text-center bg-linear-to-br from-primary/10 via-card to-card">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
          Ready to Transform Your Streams?
        </h2>
        <p className="text-foreground/70 text-xl mb-8 text-balance">
          Join thousands of creators who are revolutionizing audience engagement
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition text-lg">
            Start Your Free Trial
          </button>
          <button className="bg-foreground/10 text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-foreground/20 transition text-lg">
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  )
}
