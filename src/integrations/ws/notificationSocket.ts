import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationDto } from "@/integrations/api/types";

/**
 * STOMP client wrap WebSocket (SockJS) cho notification realtime.
 *
 * BE config:
 *   - Endpoint:        /ws (SockJS)
 *   - Destination:     /user/queue/notifications
 *   - Auth:            CONNECT frame header `Authorization: Bearer <jwt>`
 *
 * Lifecycle:
 *   - Client tự reconnect mỗi 5s khi mất kết nối.
 *   - Khi access token hết hạn, server đóng kết nối ở CONNECT lần sau (401);
 *     caller chịu trách nhiệm gọi disconnect() và tạo lại với token mới.
 */

const WS_BASE: string =
  (import.meta.env.VITE_WS_URL as string | undefined) ||
  // fallback: derive từ VITE_API_URL bằng cách bỏ "/api/v1"
  (() => {
    const api = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8080/api/v1";
    return api.replace(/\/api\/v1\/?$/, "");
  })();

const WS_ENDPOINT = `${WS_BASE}/ws`;

export type NotificationHandler = (notification: NotificationDto) => void;

export interface NotificationSocketHandle {
  disconnect: () => void;
  /** True khi STOMP đã CONNECTED thành công. */
  isConnected: () => boolean;
}

export function connectNotificationSocket(
  token: string,
  onNotification: NotificationHandler,
  options?: { onError?: (msg: string) => void; debug?: boolean }
): NotificationSocketHandle {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT) as unknown as WebSocket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5_000,
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
    debug: options?.debug ? (str) => console.debug("[STOMP]", str) : () => {},
  });

  client.onConnect = () => {
    client.subscribe("/user/queue/notifications", (msg: IMessage) => {
      try {
        const dto = JSON.parse(msg.body) as NotificationDto;
        onNotification(dto);
      } catch (e) {
        console.warn("Failed to parse notification payload:", e);
      }
    });
  };

  client.onStompError = (frame) => {
    const msg = frame.headers["message"] || "STOMP error";
    options?.onError?.(msg);
  };

  client.onWebSocketError = (evt) => {
    options?.onError?.((evt as ErrorEvent).message ?? "WebSocket error");
  };

  client.activate();

  return {
    disconnect: () => {
      void client.deactivate();
    },
    isConnected: () => client.connected,
  };
}
