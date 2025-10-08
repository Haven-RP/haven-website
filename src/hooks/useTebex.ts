import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";

// Tebex Headless API - can be called directly from browser (no auth needed)
// Documentation: https://docs.tebex.io/developers/headless-api/overview
const HEADLESS_API_BASE = "https://headless.tebex.io/api";
const WEBSTORE_TOKEN = siteConfig.tebexWebstoreToken;

// Headless API Response Types - https://docs.tebex.io/developers/headless-api/overview
export interface TebexPackage {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: "single" | "subscription";
  category: {
    id: number;
    name: string;
  };
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  discount: number;
  disable_quantity: boolean;
  disable_gifting: boolean;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TebexCategory {
  id: number;
  name: string;
  slug: string;
  parent: Record<string, any>;
  description: string;
  packages: TebexPackage[];
  order: number;
  display_type: string;
}

export interface TebexWebstore {
  ident: string;
  account: {
    id: number;
    domain: string;
    name: string;
    currency: {
      iso: string;
      symbol: string;
    };
  };
  webstore_url: string;
}

// Fetch webstore information (derived from categories call)
export const useTebexWebstore = () => {
  return useQuery<TebexWebstore, Error>({
    queryKey: ["tebex-webstore"],
    queryFn: async () => {
      // The Headless API doesn't have a dedicated webstore info endpoint
      // We'll derive currency info from the categories response
      const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/categories?includePackages=1`);

      if (!response.ok) {
        throw new Error(`Failed to fetch webstore info: ${response.status}`);
      }

      const result = await response.json();
      const firstPackage = result.data?.[0]?.packages?.[0];
      
      // Build a minimal webstore object from available data
      return {
        ident: WEBSTORE_TOKEN,
        account: {
          id: 0,
          domain: siteConfig.tebexStorefrontUrl,
          name: siteConfig.serverName,
          currency: {
            iso: firstPackage?.currency || 'USD',
            symbol: '$', // Default, will be replaced by actual package data
          },
        },
        webstore_url: `https://${siteConfig.tebexStorefrontUrl}`,
      };
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });
};

// Fetch all categories with packages
export const useTebexCategories = () => {
  return useQuery<TebexCategory[], Error>({
    queryKey: ["tebex-categories"],
    queryFn: async () => {
      const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/categories?includePackages=1`);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const result = await response.json();
      return result.data; // Headless API returns { data: [...] }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

// Fetch packages for a specific category
export const useTebexCategoryPackages = (categoryId: number | null) => {
  return useQuery<TebexCategory, Error>({
    queryKey: ["tebex-category-packages", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error("No category ID provided");
      }

      const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/categories/${categoryId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch category packages: ${response.status}`);
      }

      const result = await response.json();
      return result.data; // Headless API returns { data: { ...category } }
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

// Fetch a specific package by ID
export const useTebexPackage = (packageId: number | null) => {
  return useQuery<TebexPackage, Error>({
    queryKey: ["tebex-package", packageId],
    queryFn: async () => {
      if (!packageId) {
        throw new Error("No package ID provided");
      }

      const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/packages/${packageId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch package: ${response.status}`);
      }

      const result = await response.json();
      return result.data; // Headless API returns { data: { ...package } }
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

