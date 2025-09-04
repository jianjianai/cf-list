/// <reference types="vite/client" />
/// <reference lib="dom" />

declare module '@ftypes/api' {
  export * from '../types/api';
}

declare module '@ftypes/api.js' {
  export * from '../types/api';
}

declare global {
  interface Navigator {
    clipboard: {
      writeText(text: string): Promise<void>;
    };
  }
}
