import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/useAuth";
import {
  useChatHistory,
  useChatSocket,
  useMarkChatRead,
  useMyConversation,
  useSendImage,
  useSendMessage,
} from "./useChat";
import type { MessageDto } from "@/integrations/api/types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ChatWidget() {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useMyConversation();
  const historyEnabled = !!conversation;
  const { data: history, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatHistory(historyEnabled);
  const sendText = useSendMessage();
  const sendImage = useSendImage();
  const markRead = useMarkChatRead();

  useChatSocket({
    onIncoming: (m) => {
      if (!open && m.senderRole === "ADMIN") {
        toast("Hỗ trợ ChipTrip", { description: m.messageType === "IMAGE" ? "Đã gửi 1 ảnh" : m.content ?? "" });
      }
    },
  });

  // Flatten + reverse để render từ cũ→mới (đáy là tin mới nhất).
  const messages: MessageDto[] = useMemo(() => {
    if (!history) return [];
    const all = history.pages.flat();
    // pages[0] có tin mới nhất ở index 0; gộp ngược lại để có thứ tự cũ→mới
    return [...all].reverse();
  }, [history]);

  // Auto scroll to bottom khi panel mở hoặc có tin mới (kể cả mình gửi).
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  // Khi mở panel → markRead
  useEffect(() => {
    if (!open || !conversation) return;
    if (conversation.unreadCount > 0) {
      markRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Infinite scroll lên top: dùng IntersectionObserver trên sentinel
  useEffect(() => {
    if (!open) return;
    const el = topSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!user || isAdmin) return null; // chỉ user thường

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    sendText.mutate(text, {
      onError: (e) => toast.error("Gửi tin thất bại", { description: (e as Error).message }),
    });
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Ảnh vượt quá 5MB");
      return;
    }
    sendImage.mutate(file, {
      onError: (err) => toast.error("Tải ảnh thất bại", { description: (err as Error).message }),
    });
  };

  const unread = conversation?.unreadCount ?? 0;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          aria-label="Mở chat hỗ trợ"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
              <div>
                <p className="text-sm font-semibold">Hỗ trợ ChipTrip</p>
                <p className="text-xs text-muted-foreground">Phản hồi trong giờ hành chính</p>
              </div>
              <button
                type="button"
                aria-label="Đóng chat"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              <div ref={topSentinelRef} />
              {isFetchingNextPage && (
                <p className="text-center text-xs text-muted-foreground">Đang tải tin cũ…</p>
              )}
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">
                  Chào bạn 👋 Gửi tin nhắn để được hỗ trợ.
                </p>
              )}
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>

            <footer className="border-t border-border p-2">
              <div className="flex items-end gap-1.5">
                <button
                  type="button"
                  aria-label="Đính kèm ảnh"
                  onClick={handlePickImage}
                  disabled={sendImage.isPending}
                  className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="chat-draft" className="sr-only">Nội dung tin nhắn</label>
                <textarea
                  id="chat-draft"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Nhập tin nhắn…"
                  className="flex-1 resize-none bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24"
                />
                <button
                  type="button"
                  aria-label="Gửi"
                  onClick={handleSend}
                  disabled={!draft.trim() || sendText.isPending}
                  className="w-9 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: MessageDto }) {
  const isMine = message.senderRole === "USER";
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
          isMine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {message.messageType === "IMAGE" && message.imageUrl ? (
          <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={message.imageUrl}
              alt="Ảnh đính kèm"
              className="rounded-lg max-h-48 object-cover"
              loading="lazy"
            />
          </a>
        ) : (
          <span>{message.content}</span>
        )}
        <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
