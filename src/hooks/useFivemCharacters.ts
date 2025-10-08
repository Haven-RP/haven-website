import { useQuery } from "@tanstack/react-query";

const FIVEM_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

interface Money {
  bank: number;
  crypto: number;
  cash: number;
}

interface CharInfo {
  citizenid: number;
  birthdate: string;
  nationality: string;
  account: string;
  lastname: string;
  firstname: string;
  gender: number;
  backstory: string;
  phone: string;
  cid: number;
}

interface Job {
  bankAuth: boolean;
  name: string;
  grade: {
    name: string;
    level: number;
  };
  payment: number;
  isboss: boolean;
  onduty: boolean;
  label: string;
}

interface Gang {
  bankAuth: boolean;
  name: string;
  isboss: boolean;
  grade: {
    name: string;
    level: number;
  };
  label: string;
}

export interface FivemCharacter {
  id: number;
  citizenid: string;
  cid: number;
  name: string;
  money: string; // JSON string
  charinfo: string; // JSON string
  job: string; // JSON string
  gang: string; // JSON string
  phone_number: string | null;
  last_updated: string;
  last_logged_out: string;
  health: number;
  armor: number;
  jail: number;
  badge: string | null;
}

export interface ParsedCharacter extends FivemCharacter {
  moneyData: Money;
  charinfoData: CharInfo;
  jobData: Job;
  gangData: Gang;
}

interface CharactersResponse {
  success: boolean;
  message: string;
  data: {
    discord_id: string;
    character_count: number;
    characters: FivemCharacter[];
  };
}

export const useFivemCharacters = (discordId: string | null | undefined) => {
  return useQuery({
    queryKey: ["fivem-characters", discordId],
    queryFn: async () => {
      if (!discordId) {
        throw new Error("No Discord ID provided");
      }

      if (!API_KEY) {
        console.error("VITE_HAVEN_API_KEY not configured");
        throw new Error("HavenRP API key not configured");
      }

      try {
        const response = await fetch(
          `${FIVEM_API_URL}/fivem/user/discord:${discordId}/characters`,
          {
            method: "GET",
            headers: {
              "accept": "application/json",
              "X-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.status} ${response.statusText}`);
        }

        const data: CharactersResponse = await response.json();
        
        // Parse JSON strings in each character
        const parsedCharacters: ParsedCharacter[] = data.data.characters.map(char => ({
          ...char,
          moneyData: JSON.parse(char.money),
          charinfoData: JSON.parse(char.charinfo),
          jobData: JSON.parse(char.job),
          gangData: JSON.parse(char.gang),
        }));

        return {
          ...data.data,
          characters: parsedCharacters,
        };
      } catch (error) {
        console.error("Error fetching FiveM characters:", error);
        throw error;
      }
    },
    enabled: !!discordId && !!API_KEY,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 2,
  });
};

