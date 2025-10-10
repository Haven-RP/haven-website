import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const API_URL = import.meta.env.VITE_DISCORD_ROLES_API_URL?.replace('/discord/roles', '') || "https://api.haven-rp.com/api";
const API_KEY = import.meta.env.VITE_HAVEN_API_KEY;

// Types
export interface Campaign {
  id: number;
  title: string;
  description?: string;
  status: "draft" | "nominations_open" | "voting_open" | "closed";
  allow_self_nomination: boolean;
  max_nominations_per_user: number;
  created_at: string;
  updated_at?: string;
}

export interface Nominee {
  campaign_id: number;
  nominee_discord_id: string;
  nominee_username: string;
  nomination_count: number;
  vote_count: number;
  first_nominated_at: string;
}

export interface Nomination {
  id: number;
  campaign_id: number;
  nominee_discord_id: string;
  nominee_username: string;
  is_self_nomination: boolean;
  created_at: string;
}

export interface Vote {
  id: number;
  campaign_id: number;
  nominee_discord_id: string;
  created_at: string;
}

// Helper to get auth token
async function getAuthToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }
  return session.access_token;
}

// Fetch all campaigns
export const useCouncilCampaigns = (options?: { status?: string; include_closed?: boolean }) => {
  const queryParams = new URLSearchParams();
  if (options?.status) queryParams.append("status", options.status);
  if (options?.include_closed) queryParams.append("include_closed", "true");
  
  const queryString = queryParams.toString();
  const url = `${API_URL}/council/campaigns${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["council-campaigns", options],
    queryFn: async () => {
      const response = await fetch(url, {
        headers: {
          "accept": "application/json",
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.status}`);
      }

      const result = await response.json();
      return result.data.campaigns as Campaign[];
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};

// Fetch single campaign details
export const useCouncilCampaign = (campaignId: number | null) => {
  return useQuery({
    queryKey: ["council-campaign", campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("No campaign ID");

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}`, {
        headers: {
          "accept": "application/json",
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch campaign: ${response.status}`);
      }

      const result = await response.json();
      return result.data.campaign as Campaign;
    },
    enabled: !!campaignId,
    staleTime: 30 * 1000,
  });
};

// Fetch nominees for a campaign
export const useCouncilNominees = (campaignId: number | null) => {
  return useQuery({
    queryKey: ["council-nominees", campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("No campaign ID");

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}/nominees`, {
        headers: {
          "accept": "application/json",
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nominees: ${response.status}`);
      }

      const result = await response.json();
      return result.data.nominees as Nominee[];
    },
    enabled: !!campaignId,
    staleTime: 15 * 1000, // Cache for 15 seconds (more frequent updates during voting)
  });
};

// Fetch user's nomination for a campaign
export const useMyNomination = (campaignId: number | null) => {
  return useQuery({
    queryKey: ["my-nomination", campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("No campaign ID");

      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}/my-nomination`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null; // User hasn't nominated
        throw new Error(`Failed to fetch nomination: ${response.status}`);
      }

      const result = await response.json();
      return result.data.nomination as Nomination | null;
    },
    enabled: !!campaignId,
  });
};

// Fetch user's vote for a campaign
export const useMyVote = (campaignId: number | null) => {
  return useQuery({
    queryKey: ["my-vote", campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("No campaign ID");

      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}/my-vote`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null; // User hasn't voted
        throw new Error(`Failed to fetch vote: ${response.status}`);
      }

      const result = await response.json();
      return result.data.vote as Vote | null;
    },
    enabled: !!campaignId,
  });
};

// Create campaign (Admin only)
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      allow_self_nomination?: boolean;
      max_nominations_per_user?: number;
    }) => {
      const token = await getAuthToken();
      
      console.log("Creating campaign with:");
      console.log("- URL:", `${API_URL}/council/campaigns`);
      console.log("- Has API Key:", !!API_KEY);
      console.log("- Has Token:", !!token);
      console.log("- Token prefix:", token?.substring(0, 20) + "...");

      const response = await fetch(`${API_URL}/council/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        throw new Error(error.message || `Failed to create campaign: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["council-campaigns"] });
    },
  });
};

// Update campaign (Admin only)
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, data }: {
      campaignId: number;
      data: Partial<Pick<Campaign, "title" | "description" | "status">>;
    }) => {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to update campaign: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["council-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["council-campaign", variables.campaignId] });
    },
  });
};

// Delete campaign (Admin only)
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: number) => {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to delete campaign: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["council-campaigns"] });
    },
  });
};

// Nominate a user
export const useNominateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, nomineeDiscordId }: {
      campaignId: number;
      nomineeDiscordId: string;
    }) => {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}/nominate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({ nominee_discord_id: nomineeDiscordId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to nominate user: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["council-nominees", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["my-nomination", variables.campaignId] });
    },
  });
};

// Vote for nominee
export const useVoteForNominee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, nomineeDiscordId }: {
      campaignId: number;
      nomineeDiscordId: string;
    }) => {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/council/campaigns/${campaignId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({ nominee_discord_id: nomineeDiscordId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to vote: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["council-nominees", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["my-vote", variables.campaignId] });
    },
  });
};

