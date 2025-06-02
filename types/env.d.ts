declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FIGMA_ACCESS_TOKEN: string;
      EXPO_PUBLIC_FIGMA_FILE_KEY: string;
    }
  }
}

export {};