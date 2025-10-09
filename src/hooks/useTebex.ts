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

export interface TebexBasket {
  ident: string;
  complete: boolean;
  links: {
    checkout: string;
    payment?: string;
  };
  id: number;
  total_price: number;
  currency: string;
}

// Create a new basket with a package
export const createBasketWithPackage = async (
  packageId: number,
  quantity: number = 1
): Promise<TebexBasket> => {
  const requestBody = {
    complete_url: `${window.location.origin}/store?success=true`,
    cancel_url: `${window.location.origin}/store`,
    packages: [
      {
        package: packageId,
        quantity: quantity,
        type: 'single',
      },
    ],
  };

  console.log('Creating basket with request:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/baskets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create basket error response:', errorText);
    throw new Error(`Failed to create basket: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Basket created response:', result);
  return result.data;
};

// Create a new empty basket (for adding packages later)
export const createBasket = async (
  email?: string, 
  username?: string,
  discordId?: string,
  fivemCitizenId?: string
): Promise<TebexBasket> => {
  const requestBody: any = {
    complete_url: `${window.location.origin}/store?success=true`,
    cancel_url: `${window.location.origin}/store`,
  };

  // Add email if provided (allows adding packages to basket)
  if (email) {
    requestBody.email = email;
  }

  // Add username if provided
  if (username) {
    requestBody.username = username;
  }

  // Add custom fields for Discord and FiveM identification
  const customFields: any = {};
  
  if (discordId) {
    customFields.discord_id = discordId;
  }
  
  if (fivemCitizenId) {
    customFields.fivem_citizen_id = fivemCitizenId;
  }

  // Only add custom object if we have fields
  if (Object.keys(customFields).length > 0) {
    requestBody.custom = customFields;
  }

  console.log('Creating basket with:', requestBody);

  const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/baskets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create basket error response:', errorText);
    throw new Error(`Failed to create basket: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Basket created with auth:', result);
  return result.data;
};

// Add package to basket
export const addPackageToBasket = async (
  basketIdent: string,
  packageId: number,
  quantity: number = 1
): Promise<TebexBasket> => {
  const requestBody = {
    package_id: packageId,
    quantity: quantity,
  };

  console.log('Adding package to basket:', basketIdent, JSON.stringify(requestBody, null, 2));

  const response = await fetch(
    `${HEADLESS_API_BASE}/baskets/${basketIdent}/packages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(requestBody),
    }
  );

  console.log('Add package response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Add package error response:', errorText);
    throw new Error(`Failed to add package to basket: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Package added, basket response:', result);
  return result.data;
};

// Get basket details
export const getBasket = async (basketIdent: string): Promise<TebexBasket> => {
  const response = await fetch(`${HEADLESS_API_BASE}/accounts/${WEBSTORE_TOKEN}/baskets/${basketIdent}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch basket: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

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

