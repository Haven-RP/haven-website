import { useQuery } from "@tanstack/react-query";

const FIVEM_API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY || "";

export interface FivemVehicle {
  plate: string;
  fuel: number;
  engine: number;
  body: number;
  favourite: number;
  mileage: number;
  brand: string | null;
  model: string | null;
  category: string | null;
  dealership: string | null;
}

interface VehiclesResponse {
  success: boolean;
  message: string;
  data: {
    citizenid: string;
    vehicle_count: number;
    vehicles: FivemVehicle[];
  };
}

export const useFivemVehicles = (citizenid: string | null | undefined) => {
  return useQuery({
    queryKey: ["fivem-vehicles", citizenid],
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
          `${FIVEM_API_URL}/fivem/character/${citizenid}/vehicles`,
          {
            method: "GET",
            headers: {
              "accept": "application/json",
              "X-API-Key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
        }

        const result: VehiclesResponse = await response.json();
        
        // Sort vehicles: favorites first, then by plate
        const sortedVehicles = [...result.data.vehicles].sort((a, b) => {
          if (a.favourite !== b.favourite) {
            return b.favourite - a.favourite; // Favorites first
          }
          return a.plate.localeCompare(b.plate);
        });

        return {
          ...result.data,
          vehicles: sortedVehicles,
        };
      } catch (error) {
        console.error("Error fetching FiveM vehicles:", error);
        throw error;
      }
    },
    enabled: !!citizenid && !!API_KEY,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 2,
  });
};

