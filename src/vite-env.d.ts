/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_GA4_MEASUREMENT_ID?: string;
  }

  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
