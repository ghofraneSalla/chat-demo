import type { IChat, IConversation } from "../../types";

export interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

export interface RequestResponse<T = unknown> {
  data?: T;
  error?: string;
  status?: number;
}

export interface SallaChatContextType {
  openChat: (chat: IChat) => void;
  closeChat: () => void;
  request: <T = unknown>(url: string, params: RequestParams) => Promise<RequestResponse<T>>;
  enabled: boolean;
  conversations: IConversation[];
  fetchConversations: () => Promise<void>;
  loading: boolean;
  error: string | null;
  selectedConversation: IConversation | null;
  selectConversation: (conversation: IConversation) => void;
}
