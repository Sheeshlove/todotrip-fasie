/// <reference types="vite/client" />

interface Window {
  updateProfileCache?: (userId: string, profile: any) => void;
}
