import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import pageBg from "@/assets/page-bg.png";

const Apply = () => {
  const checklist = [
    "Be at least 16 years of age",
    "Have a working microphone",
    "Discord account in good standing",
    "Understanding of basic roleplay concepts",
    "No active bans on other serious RP servers",
    "Ability to commit at least 10 hours per week",
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
              Start your journey in Los Santos with our whitelist application process.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">

          {/* How It Works */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-primary">
              How Whitelisting Works
            </h2>
            <div className="space-y-4 text-foreground/90">
              <p>
                HavenRP uses a comprehensive whitelist system to ensure every player is committed 
                to quality roleplay. Our application process is managed through AppyBot in our 
                Discord server.
              </p>
              <p>
                The application typically takes 10-15 minutes to complete and includes questions 
                about your roleplay experience, character concepts, and understanding of our rules.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-accent">Review Time:</strong> Most applications are 
                reviewed within 24-48 hours. You'll be notified via Discord once your application 
                has been processed.
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

          {/* Application CTA */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center border-2 border-primary/30">
            <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
              Ready to Apply?
            </h2>
            <p className="text-muted-foreground mb-6">
              {siteConfig.appyInstruction}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-neon hover:shadow-neon-cyan transition-all duration-300 text-lg px-8 py-6"
                asChild
              >
                <a
                  href={siteConfig.appyChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Start Application with Appy
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 hover:shadow-neon-magenta transition-all duration-300 text-lg px-8 py-6"
                asChild
              >
                <a
                  href={siteConfig.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join Discord First
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Don't have Discord yet? Join our server first, then head to the application channel.
            </p>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8">
            <h3 className="text-xl font-heading font-bold mb-4 text-accent">
              Application Tips
            </h3>
            <ul className="space-y-3 text-foreground/90">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Read our server rules thoroughly before applying.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Take your time and provide detailed, thoughtful answers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Have a clear character concept in mind before starting.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Proper grammar and spelling show attention to detail.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Be honest about your experience level - we welcome all skill levels!</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Apply;
