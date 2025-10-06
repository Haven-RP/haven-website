import { Shield, Briefcase, DollarSign, Siren, Heart, Calendar } from "lucide-react";

export const FeatureTiles = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Jobs & Factions",
      description: "Join diverse careers and criminal organizations. Build your empire or protect the city.",
      color: "text-secondary",
      borderColor: "border-secondary/30",
      hoverGlow: "hover:shadow-neon-magenta",
    },
    {
      icon: DollarSign,
      title: "Dynamic Economy",
      description: "Realistic economy system with businesses, banking, and legal/illegal money-making opportunities.",
      color: "text-accent",
      borderColor: "border-accent/30",
      hoverGlow: "hover:shadow-neon-purple",
    },
    {
      icon: Siren,
      title: "Police Department",
      description: "Professional law enforcement with realistic procedures, investigations, and court systems.",
      color: "text-blue-accent",
      borderColor: "border-blue-accent/30",
      hoverGlow: "hover:shadow-neon-blue",
    },
    {
      icon: Heart,
      title: "EMS & Medical",
      description: "Advanced medical system with dedicated EMS teams providing realistic healthcare services.",
      color: "text-primary",
      borderColor: "border-primary/30",
      hoverGlow: "hover:shadow-neon-cyan",
    },
    {
      icon: Calendar,
      title: "Community Events",
      description: "Regular server events, tournaments, and community-driven storylines to keep things exciting.",
      color: "text-secondary",
      borderColor: "border-secondary/30",
      hoverGlow: "hover:shadow-neon-magenta",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">
          <span className="text-neon-cyan">Server </span>
          <span className="text-neon-magenta">Features</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`glass-card p-6 border ${feature.borderColor} ${feature.hoverGlow} transition-all duration-300 group`}
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className={`text-xl font-heading font-bold mb-2 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
