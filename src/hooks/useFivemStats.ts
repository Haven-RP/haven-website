import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";

interface FivemServerData {
  Data: {
    clients: number;
    sv_maxclients: number;
  };
}

export const useFivemStats = () => {
  return useQuery({
    queryKey: ["fivem-stats", siteConfig.cfxCode],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://servers-frontend.fivem.net/api/servers/single/${siteConfig.cfxCode}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch server stats");
        }

        const data: FivemServerData = await response.json();
        
        return {
          online: data.Data.clients || 0,
          maxPlayers: data.Data.sv_maxclients || siteConfig.maxPlayers,
          isOnline: true,
        };
      } catch (error) {
        console.error("Error fetching FiveM stats:", error);
        return {
          online: 0,
          maxPlayers: siteConfig.maxPlayers,
          isOnline: false,
        };
      }
    },
    refetchInterval: 60000, // Refresh every 60 seconds
    staleTime: 30000,
  });
};
