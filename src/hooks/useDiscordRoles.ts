import { useQuery } from "@tanstack/react-query";

const DISCORD_ROLES_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL || "https://api.haven-rp.com/api/discord/roles";
const DISCORD_API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
}

export interface DiscordRolesResponse {
  success: boolean;
  message: string;
  discord_id: string;
  roles: {
    [key: string]: DiscordRole;
  };
}

/**
 * Fetch all roles in the guild (admin use)
 */
export const useAllDiscordRoles = () => {
  return useQuery({
    queryKey: ["discord-roles-all"],
    queryFn: async () => {
      if (!DISCORD_API_KEY) {
        console.error("VITE_HAVEN_API_KEY not configured");
        throw new Error("HavenRP API key not configured");
      }

      const url = DISCORD_ROLES_API_URL.replace(/\/roles$/, "") + "/all";

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": DISCORD_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch all Discord roles: ${response.status}`);
      }

      const data = await response.json();
      // Expecting { roles: DiscordRole[] } or object map; normalize to array
      const rolesArray: DiscordRole[] = Array.isArray(data.roles)
        ? data.roles
        : Object.values(data.roles || {});
      // de-duplicate by id just in case
      const deduped = Array.from(new Map(rolesArray.map(r => [r.id, r])).values());
      // Sort alphabetically by name
      deduped.sort((a, b) => a.name.localeCompare(b.name));
      return deduped;
    },
    staleTime: 10 * 60 * 1000,
  });
};

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

