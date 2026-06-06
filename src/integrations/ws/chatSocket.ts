import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { MessageDto } from "@/integrations/api/types";

/**
 * STOMP client cho chat realtime.
 *
 * Destinations:
 *   - /user/queue/messages   → tin nhắn của chính user (cả user gửi & admin reply)
 *   - /topic/support         → admin pool nhận MỌI tin (chỉ subscribe được khi token có ROLE_ADMIN)
 *
 * Auth: CONNECT header `Authorization: Bearer <jwt>` (verify ở BE JwtChannelInterceptor).
 *
 * Lưu ý: dùng tách biệt với notificationSocket (mỗi feature 1 client) để không cross-talk.
 * Tổng có 2 STOMP client cho user thường (notifications + chat).
 */

const WS_BASE: string =
  (import.meta.env.VITE_WS_URL as string | undefined) ||
  (() => {
    const api = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8080/api/v1";
    return api.replace(/\/api\/v1\/?$/, "");
  })();

const WS_ENDPOINT = `${WS_BASE}/ws`;

export type MessageHandler = (m: MessageDto) => void;

export interface ChatSocketHandle {
  disconnect: () => void;
  isConnected: () => boolean;
}

export interface ChatSocketOptions {
  /** true = subscribe /topic/support (admin); false = subscribe /user/queue/messages (user). */
  asAdmin: boolean;
  onError?: (msg: string) => void;
  debug?: boolean;
}

export function connectChatSocket(
  token: string,
  onMessage: MessageHandler,
  options: ChatSocketOptions
): ChatSocketHandle {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT) as unknown as WebSocket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5_000,
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
    debug: options.debug ? (str) => console.debug("[STOMP-chat]", str) : () => {},
  });

  client.onConnect = () => {
    const destination = options.asAdmin ? "/topic/support" : "/user/queue/messages";
    client.subscribe(destination, (msg: IMessage) => {
      try {
        const dto = JSON.parse(msg.body) as MessageDto;
        onMessage(dto);
      } catch (e) {
        console.warn("Failed to parse chat message:", e);
      }
    });
  };

  client.onStompError = (frame) => {
    const msg = frame.headers["message"] || "STOMP error";
    options.onError?.(msg);
  };

  client.onWebSocketError = (evt) => {
    options.onError?.((evt as ErrorEvent).message ?? "WebSocket error");
  };

  client.activate();

  return {
    disconnect: () => {
      void client.deactivate();
    },
    isConnected: () => client.connected,
  };
}
