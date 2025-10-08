import { useQuery } from "@tanstack/react-query";

const DISCORD_ROLES_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL || "https://api.haven-rp.com/api/discord/roles";
const DISCORD_API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

interface DiscordRole {
  id: string;
  name: string;
  color: number;
}

interface DiscordRolesResponse {
  success: boolean;
  message: string;
  discord_id: string;
  roles: {
    [key: string]: DiscordRole;
  };
}

export const useDiscordRoles = (discordUserId: string | null | undefined) => {
  return useQuery({
    queryKey: ["discord-roles", discordUserId],
    queryFn: async () => {
      if (!discordUserId) {
        throw new Error("No Discord user ID provided");
      }

      if (!DISCORD_API_KEY) {
        console.error("VITE_HAVEN_API_KEY not configured");
        throw new Error("HavenRP API key not configured");
      }

      try {
        const response = await fetch(
          `${DISCORD_ROLES_API_URL}/${discordUserId}`,
          {
            method: "GET",
            headers: {
              "accept": "application/json",
              "X-API-Key": DISCORD_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Discord roles: ${response.status} ${response.statusText}`);
        }

        const data: DiscordRolesResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching Discord roles:", error);
        throw error;
      }
    },
    enabled: !!discordUserId && !!DISCORD_API_KEY,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

