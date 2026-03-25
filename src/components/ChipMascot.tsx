import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ChipMascotProps {
  messages: { text: string; delay?: number }[];
  storageKey?: string;
}

const ChipMascot = ({ messages, storageKey = "chip-mascot-seen" }: ChipMascotProps) => {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);

  useEffect(() => {
    if (storageKey && localStorage.getItem(storageKey)) return;
    
    const delay = messages[0]?.delay || 1500;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || messages.length <= 1) return;
    const timer = setTimeout(() => {
      if (currentMsg < messages.length - 1) {
        setCurrentMsg(prev => prev + 1);
      }
    }, messages[currentMsg + 1]?.delay || 8000);
    return () => clearTimeout(timer);
  }, [visible, currentMsg]);

  const dismiss = () => {
    setVisible(false);
    if (storageKey) localStorage.setItem(storageKey, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-2 max-w-xs"
        >
          <div className="relative bg-card border border-border rounded-2xl rounded-br-sm p-4 shadow-warm">
            <button
              onClick={dismiss}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm text-foreground leading-relaxed">
              {messages[currentMsg]?.text}
            </p>
          </div>
          <span className="text-4xl flex-shrink-0 -mb-1 animate-bounce" style={{ animationDuration: "2s" }}>🐤</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChipMascot;
