import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MessageSquare, Crown, Shield, Code, Users, DollarSign, Home, ShoppingBag, Wrench, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import heroBg from "@/assets/hero-bg-new.png";
import pageBg from "@/assets/page-bg.png";

const Staff = () => {
  const staffMembers = [
    {
      name: "Solao",
      role: "The Sky Boss",
      icon: Crown,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "The Sky Boss himself! Solao is the powerhouse keeping the city alive, overseeing server development and big-picture decisions so everything runs smoothly.",
    },
    {
      name: "Steve",
      role: "Finance & Gang Administration",
      icon: DollarSign,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Our behind-the-scenes wizard handling the city's finances and making sure gang administration stays on track.",
    },
    {
      name: "Megs",
      role: "Public Relations",
      icon: MessageSquare,
      color: "text-accent",
      borderColor: "border-accent/30",
      bio: "Got an issue? Megs has your back! She's the face of public relations, handling Discord chaos and keeping the community connected.",
    },
    {
      name: "Bryan",
      role: "Server Development",
      icon: Code,
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      bio: "New to the FiveM scene but full of energy! Bryan dives into server development, learns fast, and makes sure every player's voice is heard.",
    },
    {
      name: "Michael",
      role: "Housing Specialist",
      icon: Home,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "Looking for your dream house? Michael's your go-to guy. He'll help design and build the perfect place within budget, of course!",
    },
    {
      name: "Chihiro",
      role: "Housing & Merchandise",
      icon: ShoppingBag,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Not only helping out with housing, but also spearheading community merch drops — so you can rep the city in style.",
    },
    {
      name: "Lorenzo",
      role: "Vehicle Tuning Master",
      icon: Wrench,
      color: "text-accent",
      borderColor: "border-accent/30",
      bio: "The master of engines — tuning, tweaking, and making every ride feel just right. Community input fuels his underground workshop.",
    },
    {
      name: "Ant",
      role: "Tuning, Services & Events",
      icon: Settings,
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      bio: "Part gearhead, part city planner. Ant helps with tuning, manages documentation, runs all city services, and throws events that let the community cut loose.",
    },
    {
      name: "Scarlett",
      role: "Housing Administration",
      icon: Home,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "Quiet but powerful — Scarlett works behind the curtains making sure housing administration stays on point.",
    },
    {
      name: "Rafa",
      role: "Gangs & Tuning",
      icon: Shield,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Right-hand to gangs and tuning crews, Rafa helps keep both scenes organized and thriving.",
    },
    {
      name: "Bubbles",
      role: "Gang Admin & City Reports",
      icon: FileText,
      color: "text-accent",
      borderColor: "border-accent/30",
      bio: "Balancing gangs and city life! Bubbles helps with gang administration while also running in-city reports for the community.",
    },
    {
      name: "Green",
      role: "Gang Administration",
      icon: Shield,
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      bio: "Fresh on the staff team — Green is stepping into the world of gang administration and already making waves.",
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
              <span className="text-neon-cyan">Meet the Team </span>
              <span className="text-neon-magenta">Behind the City</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              The dedicated staff keeping HavenRP running smoothly
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((member, index) => (
              <div
                key={index}
                className={`bg-black/50 backdrop-blur-sm border ${member.borderColor} rounded-lg p-6 hover:shadow-neon-cyan transition-all duration-300 group`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-card/50 border ${member.borderColor}`}>
                    <member.icon className={`w-8 h-8 ${member.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className={`text-sm font-medium ${member.color}`}>
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-foreground/80 text-sm mb-6 leading-relaxed">
                  {member.bio}
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  className={`w-full border-${member.color} ${member.color} hover:bg-card/50`}
                  asChild
                >
                  <a
                    href={siteConfig.discordInvite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact on Discord
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Join Staff CTA */}
          <div className="mt-16 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center border-2 border-accent/30">
            <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold mb-4 text-accent">
              Interested in Joining Our Team?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for dedicated individuals to join our staff team. 
              Staff applications open periodically - join our Discord to stay updated 
              on recruitment opportunities.
            </p>
            <Button
              size="lg"
              className="bg-gradient-purple-blue hover:shadow-neon-purple transition-all duration-300"
              asChild
            >
              <a
                href={siteConfig.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Join Our Discord
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Staff;
