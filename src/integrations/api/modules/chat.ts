import { apiClient } from "../client";
import type {
  AdminConversationDto,
  ApiResponse,
  ConversationDto,
  MessageDto,
} from "../types";

// ============== User side ==============
export const chatApi = {
  getConversation: async (): Promise<ConversationDto> => {
    const res = await apiClient.get<ApiResponse<ConversationDto>>("/chat/conversation");
    return res.data.data;
  },

  history: async (before?: number, size = 20): Promise<MessageDto[]> => {
    const res = await apiClient.get<ApiResponse<MessageDto[]>>("/chat/conversation/messages", {
      params: before != null ? { before, size } : { size },
    });
    return res.data.data;
  },

  sendText: async (content: string): Promise<MessageDto> => {
    const res = await apiClient.post<ApiResponse<MessageDto>>("/chat/messages", { content });
    return res.data.data;
  },

  sendImage: async (file: File): Promise<MessageDto> => {
    const form = new FormData();
    form.append("file", file);
    const res = await apiClient.post<ApiResponse<MessageDto>>("/chat/messages/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  markRead: async (): Promise<void> => {
    await apiClient.patch("/chat/conversation/read");
  },
};

// ============== Admin side ==============
export const adminChatApi = {
  listConversations: async (status: "OPEN" | "CLOSED" = "OPEN", page = 0, size = 20): Promise<AdminConversationDto[]> => {
    const res = await apiClient.get<ApiResponse<AdminConversationDto[]>>("/admin/chat/conversations", {
      params: { status, page, size },
    });
    return res.data.data;
  },

  history: async (conversationId: number, before?: number, size = 20): Promise<MessageDto[]> => {
    const res = await apiClient.get<ApiResponse<MessageDto[]>>(
      `/admin/chat/conversations/${conversationId}/messages`,
      { params: before != null ? { before, size } : { size } }
    );
    return res.data.data;
  },

  reply: async (conversationId: number, content: string): Promise<MessageDto> => {
    const res = await apiClient.post<ApiResponse<MessageDto>>(
      `/admin/chat/conversations/${conversationId}/messages`,
      { content }
    );
    return res.data.data;
  },

  replyImage: async (conversationId: number, file: File): Promise<MessageDto> => {
    const form = new FormData();
    form.append("file", file);
    const res = await apiClient.post<ApiResponse<MessageDto>>(
      `/admin/chat/conversations/${conversationId}/messages/image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  markRead: async (conversationId: number): Promise<void> => {
    await apiClient.patch(`/admin/chat/conversations/${conversationId}/read`);
  },

  close: async (conversationId: number): Promise<void> => {
    await apiClient.patch(`/admin/chat/conversations/${conversationId}/close`);
  },
};
