import { useQuery } from "@tanstack/react-query";

const FIVEM_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

interface InventoryItem {
  name: string;
  amount: number;
}

interface VehicleInventoryResponse {
  success: boolean;
  message: string;
  data: {
    plate: string;
    glovebox: string; // JSON string
    trunk: string; // JSON string
    brand: string;
    model: string;
  };
}

export interface ParsedVehicleInventory {
  plate: string;
  brand: string;
  model: string;
  glovebox: InventoryItem[];
  trunk: InventoryItem[];
}

export const useFivemVehicleInventory = (citizenid: string | null | undefined, plate: string | null | undefined) => {
  return useQuery({
    queryKey: ["fivem-vehicle-inventory", citizenid, plate],
    queryFn: async () => {
      if (!citizenid || !plate) {
        throw new Error("No citizen ID or plate provided");
      }

      if (!API_KEY) {
        console.error("VITE_HAVEN_API_KEY not configured");
        throw new Error("HavenRP API key not configured");
      }

      try {
        const response = await fetch(
          `${FIVEM_API_URL}/fivem/character/${citizenid}/vehicle/${encodeURIComponent(plate)}/inventory`,
          {
            method: "GET",
            headers: {
              "accept": "application/json",
              "X-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch vehicle inventory: ${response.status} ${response.statusText}`);
        }

        const result: VehicleInventoryResponse = await response.json();
        const data = result.data;
        
        // Parse JSON strings
        const parsed: ParsedVehicleInventory = {
          plate: data.plate,
          brand: data.brand,
          model: data.model,
          glovebox: JSON.parse(data.glovebox || "[]"),
          trunk: JSON.parse(data.trunk || "[]"),
        };

        return parsed;
      } catch (error) {
        console.error("Error fetching FiveM vehicle inventory:", error);
        throw error;
      }
    },
    enabled: !!citizenid && !!plate && !!API_KEY,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    retry: 2,
  });
};

