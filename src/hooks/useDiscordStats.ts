import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";

interface DiscordWidgetData {
  presence_count?: number;
  members?: Array<{ status: string }>;
}

export const useDiscordStats = () => {
  return useQuery({
    queryKey: ["discord-stats", siteConfig.discordGuildId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://discord.com/api/guilds/${siteConfig.discordGuildId}/widget.json`
        );
        
        if (!response.ok) {
          throw new Error("Discord widget not enabled");
        }

        const data: DiscordWidgetData = await response.json();
        
        return {
          online: data.presence_count || 0,
          total: data.members?.length || 0,
          available: true,
        };
      } catch (error) {
        console.error("Error fetching Discord stats:", error);
        return {
          online: 0,
          total: 0,
          available: false,
        };
      }
    },
    refetchInterval: 60000, // Refresh every 60 seconds
    staleTime: 30000,
  });
};
