import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY;

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  nickname: string | null;
  avatar: string | null;
  bot: boolean;
}

export interface DiscordUsersResponse {
  success: boolean;
  message: string;
  count: number;
  users: DiscordUser[];
}

/**
 * Get display name for a Discord user
 * Priority: nickname > global_name > username
 */
export const getDisplayName = (user: DiscordUser): string => {
  return user.nickname || user.global_name || user.username;
};

/**
 * Filter out bots from the user list
 */
export const filterNonBots = (users: DiscordUser[]): DiscordUser[] => {
  return users.filter(user => !user.bot);
};

/**
 * Hook to fetch all Discord users from the server
 */
export const useDiscordUsers = (options?: { roleIds?: string[]; excludeBots?: boolean }) => {
  return useQuery({
    queryKey: ["discord-users", options?.roleIds?.join(",") || "", options?.excludeBots ?? true],
    queryFn: async () => {
      const params = new URLSearchParams();
      const excludeBots = options?.excludeBots ?? true;
      if (excludeBots) params.append("exclude_bots", "true");
      if (options?.roleIds && options.roleIds.length > 0) {
        params.append("role_ids", options.roleIds.join(","));
      }

      const url = `${API_URL}/discord/users${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url, {
        headers: {
          "accept": "application/json",
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Discord users: ${response.status}`);
      }

      const result: DiscordUsersResponse = await response.json();
      
      // Also locally filter out bots as a safety net when excludeBots is enabled
      return excludeBots ? filterNonBots(result.users) : result.users;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

