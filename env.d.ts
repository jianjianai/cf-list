/// <reference types="vite/client" />
/// <reference lib="dom" />

declare module '@ftypes/api' {
  export * from '../types/api';
}

declare module '@ftypes/preview' {
  export * from '../types/preview';
}

declare global {
  interface Navigator {
    clipboard: {
      writeText(text: string): Promise<void>;
    };
  }
}
