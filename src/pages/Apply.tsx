import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import pageBg from "@/assets/page-bg.png";

const Apply = () => {
  const checklist = [
    "Be mature enough to handle the city's rules",
    "Have a working microphone",
    "Discord account in good standing",
    "Understanding of basic roleplay concepts",
    "Must have BodyCam (Medal, OBS, etc) enabled at all times."
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
              <span className="text-neon-cyan">Join </span>
              <span className="text-neon-magenta">HavenRP</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Start your journey in Los Santos.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">

          {/* How It Works */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-primary">
              How Joining Works
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p>
                HavenRP is not a whitelisted city.  However, we do require acceptance of our rules via a Discord Reaction to gain access.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-accent">Process:</strong> Join our Discord server, go to the 〘📜〙rules channel, read the rules and react to the message to confirm acceptance.
              </p>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-secondary">
              Requirements Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Apply;
