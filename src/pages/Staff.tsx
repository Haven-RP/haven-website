import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  MessageSquare,
  Crown,
  Shield,
  Code,
  DollarSign,
  Home,
  ShoppingBag,
  Wrench,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import pageBg from "@/assets/page-bg.png";

const Staff = () => {
  const staffMembers = [
    {
      name: "Solao",
      rank: "Senior Admin",
      role: "The Sky Boss",
      avatar:
          "https://cdn.discordapp.com/avatars/178543347424690176/3cef10682089ec2ae632e8d0d4e20272.webp?size=80",
      icon: Crown,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "The Sky Boss himself! Solao is the powerhouse keeping the city alive, overseeing server development and big-picture decisions so everything runs smoothly.",
    },
    {
      name: "Steve",
      rank: "Senior Admin",
      role: "Finance & Gang Administration",
      avatar:
          "https://cdn.discordapp.com/avatars/716966720874610739/6af3ff00e9ee7b7861815d431ef438f4.webp?size=80",
      icon: DollarSign,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Our behind-the-scenes wizard handling the city's finances and making sure gang administration stays on track.",
    },
    {
      name: "Bryan",
      rank: "Senior Admin",
      role: "Server Development",
      avatar:
          "https://cdn.discordapp.com/avatars/1277674339394785302/e2a8cbe8e83512a65c4008e6ff4af2a4.webp?size=80",
      icon: Code,
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      bio: "New to the FiveM scene but full of energy! Bryan dives into server development, learns fast, and makes sure every player's voice is heard.",
    },
    {
      name: "Michael",
      rank: "Admin",
      role: "Housing Specialist",
      avatar:
          "https://cdn.discordapp.com/avatars/178801765821448192/39bfc5a8c2803c8c5bba289d78cc3a95.webp?size=80",
      icon: Home,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "Looking for your dream house? Michael's your go-to guy. He'll help design and build the perfect place within budget, of course!",
    },
    {
      name: "Chihiro",
      rank: "Admin",
      role: "Housing & Merchandise",
      avatar:
          "https://cdn.discordapp.com/avatars/1136923962467684412/db184735a35d3b12100f5c70e650559a.webp?size=80",
      icon: ShoppingBag,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Not only helping out with housing, but also spearheading community merch drops — so you can rep the city in style.",
    },
    {
      name: "Lorenzo",
      rank: "Admin",
      role: "Vehicle Tuning Master",
      avatar:
          "https://cdn.discordapp.com/avatars/423998803314737173/23671e6dcb7810945384da3a6411e3e5.webp?size=80",
      icon: Wrench,
      color: "text-accent",
      borderColor: "border-accent/30",
      bio: "The master of engines — tuning, tweaking, and making every ride feel just right. Community input fuels his underground workshop.",
    },
    {
      name: "Ant",
      rank: "Admin",
      role: "Tuning, Services & Events",
      avatar:
          "https://cdn.discordapp.com/avatars/238692242133352459/a8a6648f176515c94ea5d4fd87795d2f.webp?size=80",
      icon: Settings,
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      bio: "Part gearhead, part city planner. Ant helps with tuning, manages documentation, runs all city services, and throws events that let the community cut loose.",
    },
    {
      name: "Scarlett",
      rank: "Moderator",
      role: "Housing Administration",
      avatar:
          "https://cdn.discordapp.com/avatars/788796341215166505/c8248ee437ca12939aac6241c819ab7b.webp?size=80",
      icon: Home,
      color: "text-primary",
      borderColor: "border-primary/30",
      bio: "Quiet but powerful — Scarlett works behind the curtains making sure housing administration stays on point.",
    },
    {
      name: "Rafa",
      rank: "Moderator",
      role: "Gangs & Tuning",
      avatar:
          "https://cdn.discordapp.com/avatars/955090068232630292/bfe323d912d42790f33849fb6aaa96bf.webp?size=80",
      icon: Shield,
      color: "text-secondary",
      borderColor: "border-secondary/30",
      bio: "Right-hand to gangs and tuning crews, Rafa helps keep both scenes organized and thriving.",
    },
    {
      name: "Bubbles",
      rank: "Moderator",
      role: "Gang Admin & City Reports",
      avatar:
          "https://cdn.discordapp.com/avatars/740816742602768485/3ab7464e89b1e991b73634a178ca4428.webp?size=80",
      icon: FileText,
      color: "text-accent",
      borderColor: "border-accent/30",
      bio: "Balancing gangs and city life! Bubbles helps with gang administration while also running in-city reports for the community.",
    }
  ];

  // Group staff by their ranks
  const ranks = {
    "Senior Administration Team": staffMembers.filter((member) => member.rank === "Senior Admin"),
    "Administration Team": staffMembers.filter((member) => member.rank === "Admin"),
    "Moderation Team": staffMembers.filter((member) => member.rank === "Moderator"),
  };

  return (
      <div
          className="min-h-screen bg-cover bg-center bg-fixed relative"
          style={{ backgroundImage: `url(${pageBg})` }}
      >
        <div className="relative z-10">
          <Navigation />

          <main className="pt-24 pb-16">
            <section className="relative min-h-[40vh] flex items-center justify-center mb-8">
              <div className="relative z-10 container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
                  <span className="text-neon-cyan">Meet the Team </span>
                  <span className="text-neon-magenta">Behind the City</span>
                </h1>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                  The dedicated staff keeping HavenRP running smoothly.
                </p>
              </div>
            </section>

            <div className="container mx-auto px-4">
              {Object.entries(ranks).map(([rankName, members]) => (
                  <section key={rankName} className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-foreground/90">{rankName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {members.map((member, index) => (
                          <div
                              key={index}
                              className={`bg-black/50 backdrop-blur-sm border ${member.borderColor} rounded-lg p-6 hover:shadow-neon-cyan transition-all duration-300 group`}
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div
                                  className={`p-3 rounded-lg bg-card/50 border ${member.borderColor}`}
                              >
                                {member.avatar ? (
                                    <img
                                        src={member.avatar}
                                        alt="Member Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <member.icon className={`w-8 h-8 ${member.color}`} />
                                )}
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
                          </div>
                      ))}
                    </div>
                  </section>
              ))}
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