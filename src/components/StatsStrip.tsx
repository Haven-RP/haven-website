import { Users, MessageSquare, Activity } from "lucide-react";
import { useFivemStats } from "@/hooks/useFivemStats";
import { useDiscordStats } from "@/hooks/useDiscordStats";

export const StatsStrip = () => {
  const { data: fivemStats, isLoading: fivemLoading } = useFivemStats();
  const { data: discordStats, isLoading: discordLoading } = useDiscordStats();

  const stats = [
    {
      icon: Users,
      label: "Players Online",
      value: fivemLoading
        ? "..."
        : `${fivemStats?.online || 0}/${fivemStats?.maxPlayers || 256}`,
      color: "text-primary",
      glow: "shadow-neon-cyan",
    },
    {
      icon: MessageSquare,
      label: "Discord Members",
      value: discordLoading
        ? "..."
        : discordStats?.available
        ? `${discordStats.online} Online`
        : "Join Discord",
      color: "text-secondary",
      glow: "shadow-neon-magenta",
    },
    {
      icon: Activity,
      label: "Server Status",
      value: fivemStats?.isOnline ? "Online" : "Offline",
      color: fivemStats?.isOnline ? "text-accent" : "text-muted-foreground",
      glow: fivemStats?.isOnline ? "shadow-neon-purple" : "",
    },
  ];

  return (
    <div className="glass-card py-6 px-4 mt-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-4 p-4 rounded-lg bg-card/20 border border-white/5 transition-all duration-300 hover:${stat.glow}`}
            >
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-heading font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
