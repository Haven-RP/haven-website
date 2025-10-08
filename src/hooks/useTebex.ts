import { useQuery } from "@tanstack/react-query";

const TEBEX_BASE_URL = "https://plugin.tebex.io";
const TEBEX_PUBLIC_TOKEN = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN || "";

export interface TebexCategory {
  id: number;
  order: number;
  name: string;
  only_subcategories: boolean;
  subcategories: number[];
  packages: number[];
}

export interface TebexPackage {
  id: number;
  name: string;
  image: string | null;
  price: number;
  expiry_length: number | null;
  expiry_period: string | null;
  type: string;
  category: {
    id: number;
    name: string;
  };
  global_limit: number | null;
  global_limit_period: string | null;
  user_limit: number | null;
  user_limit_period: string | null;
  servers: any[];
  description: string;
  gui_item: string | null;
  disabled: boolean;
  disable_quantity: boolean;
  custom_price: boolean;
  choose_server: boolean;
  limit_expires: boolean;
  inherit_commands: boolean;
  variable_giftcard: boolean;
  required_packages: number[];
  require_any: boolean;
  create_giftcard: boolean;
  show_until: string | null;
  custom_username: boolean;
  sale: {
    active: boolean;
    discount: number;
  } | null;
}

export interface TebexWebstore {
  id: number;
  account: {
    id: number;
    domain: string;
    name: string;
    currency: {
      iso: string;
      symbol: string;
    };
    online_mode: boolean;
    game_type: string;
    log_events: boolean;
    timezone: string;
  };
}

// Fetch webstore information
export const useTebexWebstore = () => {
  return useQuery<TebexWebstore, Error>({
    queryKey: ["tebex-webstore"],
    queryFn: async () => {
      if (!TEBEX_PUBLIC_TOKEN) {
        throw new Error("Tebex public token not configured");
      }

      const response = await fetch(`${TEBEX_BASE_URL}/information`, {
        headers: {
          "X-Tebex-Public-Token": TEBEX_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch webstore info: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!TEBEX_PUBLIC_TOKEN,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });
};

// Fetch all categories
export const useTebexCategories = () => {
  return useQuery<TebexCategory[], Error>({
    queryKey: ["tebex-categories"],
    queryFn: async () => {
      if (!TEBEX_PUBLIC_TOKEN) {
        throw new Error("Tebex public token not configured");
      }

      const response = await fetch(`${TEBEX_BASE_URL}/categories`, {
        headers: {
          "X-Tebex-Public-Token": TEBEX_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!TEBEX_PUBLIC_TOKEN,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

// Fetch packages for a specific category
export const useTebexCategoryPackages = (categoryId: number | null) => {
  return useQuery<{ packages: TebexPackage[] }, Error>({
    queryKey: ["tebex-category-packages", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error("No category ID provided");
      }

      if (!TEBEX_PUBLIC_TOKEN) {
        throw new Error("Tebex public token not configured");
      }

      const response = await fetch(`${TEBEX_BASE_URL}/categories/${categoryId}`, {
        headers: {
          "X-Tebex-Public-Token": TEBEX_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch category packages: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!categoryId && !!TEBEX_PUBLIC_TOKEN,
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

      if (!TEBEX_PUBLIC_TOKEN) {
        throw new Error("Tebex public token not configured");
      }

      const response = await fetch(`${TEBEX_BASE_URL}/packages/${packageId}`, {
        headers: {
          "X-Tebex-Public-Token": TEBEX_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch package: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!packageId && !!TEBEX_PUBLIC_TOKEN,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
};

