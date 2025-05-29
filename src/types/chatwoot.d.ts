interface ChatwootUser {
  email: string;
  name: string;
  avatar_url?: string;
}

interface ChatwootSettings {
  hideMessageBubble: boolean;
  showOnLoad: boolean;
  position: string;
  showPopoutButton: boolean;
  darkMode: boolean;
}

interface ChatwootSDK {
  run: (config: {
    websiteToken: string;
    baseUrl: string;
    locale?: string;
    position?: string;
    darkMode?: boolean;
  }) => void;
}

interface Chatwoot {
  websiteToken: string;
  hasLoaded: boolean;
  reset: () => void;
  setUser: (userId: string, userAttributes: ChatwootUser) => void;
  user: ChatwootUser | null;
  isOpen: boolean;
  toggle: (action: "open" | "close") => void;
}

interface SallaStorage {
  get: (key: string) => any;
}

interface Salla {
  storage: SallaStorage;
}

declare global {
  interface Window {
    chatwootSettings: ChatwootSettings;
    chatwootSDK: ChatwootSDK;
    $chatwoot: Chatwoot;
    salla?: Salla;
  }
}

export {};
