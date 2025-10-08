import { useQuery } from "@tanstack/react-query";

const FIVEM_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

interface InventoryItem {
  name: string;
  count: number;
  slot: number;
  metadata?: {
    durability?: number;
    components?: string[];
    ammo?: number;
    serial?: string;
    registered?: string;
    [key: string]: any;
  };
}

interface CharacterDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    citizenid: string;
    name: string;
    money: string;
    charinfo: string;
    job: string;
    gang: string;
    position: string;
    metadata: string;
    inventory: string;
    skills: string;
    bought_furniture: string;
    furniture: string;
    last_updated: string;
    health: number;
    armor: number;
    [key: string]: any;
  };
}

export interface ParsedCharacterDetail {
  id: number;
  citizenid: string;
  name: string;
  inventory: InventoryItem[];
  moneyData: any;
  charinfoData: any;
  jobData: any;
  gangData: any;
  positionData: any;
  metadataData: any;
  skillsData: any;
  health: number;
  armor: number;
}

export const useFivemCharacter = (citizenid: string | null | undefined) => {
  return useQuery({
    queryKey: ["fivem-character", citizenid],
    queryFn: async () => {
      if (!citizenid) {
        throw new Error("No citizen ID provided");
      }

      if (!API_KEY) {
        console.error("VITE_HAVEN_API_KEY not configured");
        throw new Error("HavenRP API key not configured");
      }

      try {
        const response = await fetch(
          `${FIVEM_API_URL}/fivem/character/${citizenid}`,
          {
            method: "GET",
            headers: {
              "accept": "application/json",
              "X-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch character details: ${response.status} ${response.statusText}`);
        }

        const result: CharacterDetailResponse = await response.json();
        const data = result.data;
        
        // Parse JSON strings
        const parsed: ParsedCharacterDetail = {
          id: data.id,
          citizenid: data.citizenid,
          name: data.name,
          inventory: JSON.parse(data.inventory || "[]"),
          moneyData: JSON.parse(data.money || "{}"),
          charinfoData: JSON.parse(data.charinfo || "{}"),
          jobData: JSON.parse(data.job || "{}"),
          gangData: JSON.parse(data.gang || "{}"),
          positionData: JSON.parse(data.position || "{}"),
          metadataData: JSON.parse(data.metadata || "{}"),
          skillsData: JSON.parse(data.skills || "{}"),
          health: data.health,
          armor: data.armor,
        };

        return parsed;
      } catch (error) {
        console.error("Error fetching FiveM character details:", error);
        throw error;
      }
    },
    enabled: !!citizenid && !!API_KEY,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    retry: 2,
  });
};

