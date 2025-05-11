
/// <reference types="vite/client" />

interface Window {
  ymaps3?: {
    ready: Promise<void>;
    [key: string]: any;
  }
}
