import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Target, Users, Zap, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg-new.png";
import pageBg from "@/assets/page-bg.png";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Quality Roleplay",
      description: "We prioritize immersive, realistic roleplay experiences over everything else.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our players and their stories are at the heart of everything we do.",
      color: "text-secondary",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving with custom scripts, unique features, and fresh content.",
      color: "text-accent",
    },
    {
      icon: Shield,
      title: "Fair & Transparent",
      description: "Clear rules, consistent enforcement, and staff accountability.",
      color: "text-blue-accent",
    },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${pageBg})` }}
    >
      
      <div className="relative z-10">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center mb-8">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              <span className="text-neon-cyan">About </span>
              <span className="text-neon-magenta">HavenRP</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Building the future of serious FiveM roleplay, one story at a time.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Origin Story */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-heading font-bold mb-6 text-primary">
              Our Story
            </h2>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                HavenRP was founded in 2024 by a dedicated group of roleplay enthusiasts who 
                envisioned a server where quality storytelling and immersive experiences take 
                center stage. Frustrated with the lack of serious roleplay servers that balanced 
                realism with fun, we set out to create something different.
              </p>
              <p>
                What started as a small community of 50 players has grown into a thriving city 
                of hundreds, all united by a shared passion for creating memorable stories and 
                authentic character development. Our city is built on the foundation of mutual 
                respect, creative freedom, and a commitment to maintaining the highest standards 
                of roleplay.
              </p>
              <p>
                Today, HavenRP stands as a beacon for serious roleplay in the FiveM community, 
                featuring custom-developed systems, a dedicated staff team, and a vibrant player 
                base that brings Los Santos to life every single day.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-center mb-8 text-secondary">
              What Makes Us Unique
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300"
                >
                  <value.icon className={`w-10 h-10 ${value.color} mb-4`} />
                  <h3 className={`text-xl font-heading font-bold mb-2 ${value.color}`}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Highlights */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-heading font-bold mb-6 text-accent">
              Server Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3 text-primary">
                  Custom Development
                </h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Proprietary economy system with realistic banking</li>
                  <li>• Advanced MDT for police and EMS</li>
                  <li>• Custom housing and business ownership</li>
                  <li>• Unique criminal activities and heists</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3 text-secondary">
                  Community Features
                </h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Regular community events and tournaments</li>
                  <li>• Player-driven storylines and factions</li>
                  <li>• Active Discord with 24/7 support</li>
                  <li>• Whitelist system ensuring quality players</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3 text-accent">
                  Staff Support
                </h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Experienced and active moderation team</li>
                  <li>• Fair and transparent rule enforcement</li>
                  <li>• Quick response times for tickets</li>
                  <li>• Regular staff training and updates</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3 text-blue-accent">
                  Technical Excellence
                </h3>
                <ul className="space-y-2 text-foreground/90">
                  <li>• High-performance dedicated servers</li>
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Regular updates and optimizations</li>
                  <li>• Advanced anti-cheat protection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Screenshots Placeholder */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8">
            <h2 className="text-3xl font-heading font-bold mb-6 text-primary text-center">
              Server Screenshots
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Experience the immersive world of HavenRP
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-gradient-neon rounded-lg opacity-20 flex items-center justify-center"
                >
                  <span className="text-black font-heading font-bold">Screenshot {i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Add your own server screenshots by replacing these placeholders
            </p>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default About;
