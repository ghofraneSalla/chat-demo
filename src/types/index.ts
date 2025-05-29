export interface IChat {
  id: string;
  website_token: string;
  name?: string;
  description?: string;
}

export interface IConversation {
  id: string;
  name: string;
  avatar?: string | null;
  website_token: string;
  status?: string;
  last_message?: {
    content: string;
    created_at: string;
  };
  unread_count?: number;
}
