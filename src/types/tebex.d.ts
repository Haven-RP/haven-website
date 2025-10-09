// Tebex.js TypeScript declarations
// https://docs.tebex.io/developers/tebex.js/overview

interface TebexCheckout {
  init: (config: {
    ident: string;
    theme?: 'light' | 'dark';
    colors?: {
      primary?: string;
    };
  }) => void;
  
  launch: () => void;
  
  on: (event: string, callback: (data: any) => void) => void;
  
  off: (event: string, callback?: (data: any) => void) => void;
}

interface Window {
  Tebex?: {
    checkout: TebexCheckout;
  };
}

declare const Tebex: {
  checkout: TebexCheckout;
} | undefined;

