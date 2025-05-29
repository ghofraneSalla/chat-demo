import React, { createContext, useContext, useEffect, useState } from "react";

import type { RequestParams, RequestResponse, SallaChatContextType } from "./SallaChat.interface";

import ChatDrawerComponent from "../chat-drawer/ChatDrawer.component";
import type { IChat, IConversation } from "../../types";

const SallaChatContext = createContext<SallaChatContextType | null>(null);

const initConfig = {
  baseUrl: "https://chat.salla.sa",
  apiBaseUrl: "https://experts-1ba1d9cc10862d2257530d1f4e8d49b5.salla.group/experts/v1",
  injectOnLoad: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: async <T = unknown>(_: string, __: RequestParams): Promise<RequestResponse<T>> => {
    return { data: undefined, error: "Not implemented" };
  },
  enabled: true,
};

export const SallaChatProvider = ({
  children,
  config: cnf,
}: {
  children: React.ReactNode;
  config?: Partial<typeof initConfig>;
}) => {
  const config = {
    ...initConfig,
    ...cnf,
  };

  const [selectedChat, setSelectedChat] = useState<IChat | undefined>();
  const [isChatwootReady, setIsChatwootReady] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);

  useEffect(() => {
    if (config.injectOnLoad && config.enabled) {
      injectChatwoot(config.baseUrl, () => {
        setIsChatwootReady(true);
      });
    }
  }, [config.injectOnLoad]);

  useEffect(() => {
    if (config.enabled) {
      fetchConversations();
    }
  }, [config.enabled]);

  useEffect(() => {
    if (selectedChat) {
      if (isChatwootReady) {
        initializeChatWidget(selectedChat, config.baseUrl);
      } else {
        injectChatwoot(config.baseUrl, () => {
          setIsChatwootReady(true);
          initializeChatWidget(selectedChat, config.baseUrl);
        });
      }
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await config.request<{ data: IConversation[] }>(
        `${config.apiBaseUrl}/chat/conversations`,
        { order_by: 'created_desc', page: 1 }
      );

      if (response.error) {
        setError(response.error);
      } else if (response.data?.data) {
        setConversations(response.data.data);
      } else {
        setConversations([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (chat: IChat) => {
    setSelectedChat(chat);
  };

  const closeChat = () => {
    setSelectedChat(undefined);
    setSelectedConversation(null);
  };

  const selectConversation = (conversation: IConversation) => {
    setSelectedConversation(conversation);
    // Create a chat object from the conversation
    const chat: IChat = {
      id: conversation.id,
      website_token: conversation.website_token,
      name: conversation.name
    };
    openChat(chat);
  };

  return (
    <SallaChatContext.Provider
      value={{
        openChat,
        closeChat,
        request: config.request,
        enabled: config.enabled,
        conversations,
        fetchConversations,
        loading,
        error,
        selectedConversation,
        selectConversation
      }}
    >
      {children}
      <ChatDrawerComponent enabled={config.enabled} />
    </SallaChatContext.Provider>
  );
};

export const useSallaChat = () => {
  const context = useContext(SallaChatContext);
  if (!context) {
    throw new Error("useSallaChat must be used within a SallaChatProvider");
  }
  return context;
};

const injectChatwoot = (baseUrl: string, onReady: () => void) => {
  if (!document.getElementById("chatwoot-sdk")) {
    const script = document.createElement("script");

    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.id = "chatwoot-sdk";

    script.onerror = (error) => {
      console.error("Error loading Chatwoot SDK:", error);
    };

    script.onload = () => {
      onReady();
    };

    document.body.appendChild(script);
  }
};

const initializeChatWidget = (chat: IChat, baseUrl: string) => {
  if (!chat.website_token) {
    console.error("Missing websiteToken in chat object:", chat);
    return;
  }

  window.chatwootSettings = {
    hideMessageBubble: false,
    showOnLoad: false,
    position: "right",
    showPopoutButton: false,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    darkMode: window.salla?.storage?.get("isDark") || false,
  };

  if (window.$chatwoot) {
    // @ref https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/entrypoints/sdk.js#L188
    window.$chatwoot.websiteToken = chat.website_token;
    window.$chatwoot.hasLoaded = false;
    window.$chatwoot.reset();
  }

  window.chatwootSDK.run({
    websiteToken: chat.website_token,
    baseUrl: baseUrl,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    locale: window.salla?.storage?.get("i18nextLng") || "ar",
    position: "right",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    darkMode: window.salla?.storage?.get("isDark") || false,
  });

  if (!window.$chatwoot) {
    console.error("Chatwoot SDK not initialized");
    return;
  }

  window.addEventListener("chatwoot:ready", function () {
    identifyUser();
  });
};

const identifyUser = () => {
  if (!window.$chatwoot) {
    console.error("Chatwoot SDK not initialized");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { merchant, email, avatar, name } =
      {
        "name": "أميمة محمد مصطفى محمد حمودة",
        "email": "omima@salla.sa",
        "avatar": "https://salla-dev.s3.eu-central-1.amazonaws.com/XrXj/q2yjshP7mX5ooGQO5JQg5g7lumQZumgXHdKjl44z.jpg",
        merchant: {
          "id": 633170215,
          "username": "omm.com",
          "name": "متجر الاختبار Dev لاختبار عرض عنوان المت",
          "avatar": "https://salla-dev.s3.eu-central-1.amazonaws.com/XrXj/q2yjshP7mX5ooGQO5JQg5g7lumQZumgXHdKjl44z.jpg",
          "store_location": "50.1155,8.6842",
          "plan": "pro",
          "status": "active",
          "type": "individual",
          "domain": "https://store.dev.salla.group/ar/omm.com",
          "tax_number": "333456789012333",
          "commercial_number": "123456789",
          "from_competitor": false,
          "created_at": "2019-04-28 00:00:00",
          "subscription": {
            "status": "active",
            "end_date": "2026-05-07 00:00:00",
            "is_launched": false,
            "renew": false
          },
          "referral": {
            "code": "S463LE8",
            "url": "https://s.salla.sa/register?coupon=S463LE8&utm_source=referral&utm_campaign=salla-demo&utm_medium=dashboard"
          }
        }
      };

  if(merchant?.id === undefined || !email || !name) {
    console.error("Merchant data is incomplete or missing");
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    window.$chatwoot.setUser(merchant.id.toString(), {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      email: email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name: name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      avatar_url: avatar,
    });

    if(!window.$chatwoot.user){
      console.error("Failed to set user in Chatwoot");
      return;
    }


    if (window.$chatwoot.isOpen) {
      console.log("Chatwoot widget is already open, closing it before opening again");
      window.$chatwoot.toggle("close");
    }

    window.$chatwoot.toggle("open");
    console.log("Chatwoot widget opened successfully");
  } catch (error) {
    console.error("Error opening chatwoot widget:", error);
  }
};
