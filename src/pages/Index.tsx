import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StatsStrip } from "@/components/StatsStrip";
import { ScrollingBar } from "@/components/ScrollingBar";
import { FeatureTiles } from "@/components/FeatureTiles";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileCheck, Gamepad2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import havenLogoHero from "@/assets/haven-logo-hero.png";
import pageBg from "@/assets/page-bg.png";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${pageBg})` }}
    >
      
      <div className="relative z-10">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        <div className="relative z-10 text-center px-4 animate-fade-in">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={havenLogoHero} 
              alt="HavenRP" 
              className="w-96 max-w-full mx-auto animate-float"
            />
          </div>

          <p className="text-2xl md:text-3xl font-heading text-foreground/90 mb-12">
            {siteConfig.serverTagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300 text-lg px-8 py-6"
              asChild
            >
              <a href={siteConfig.discordInvite} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-5 h-5 mr-2" />
                Join Discord
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300 text-lg px-8 py-6"
              asChild
            >
              <a href="/apply">
                <FileCheck className="w-5 h-5 mr-2" />
                Apply Now
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300 text-lg px-8 py-6"
              asChild
            >
              <a href={`fivem://connect/${siteConfig.fivemConnect}`}>
                <Gamepad2 className="w-5 h-5 mr-2" />
                Connect to Server
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Scrolling Bar */}
      <ScrollingBar />

      {/* Stats Strip */}
      <div className="container mx-auto px-4">
        <StatsStrip />
      </div>

      {/* Features */}
      <FeatureTiles />

      <Footer />
      </div>
    </div>
  );
};

export default Index;
