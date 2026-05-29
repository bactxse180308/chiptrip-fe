import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Shirt, Droplets, Smartphone, FileText, Pill, Package } from "lucide-react";
import type { PackingItem } from "@/features/planning/trip-data";

const categoryConfig: Record<string, { label: string; icon: React.ElementType; emoji: string }> = {
  documents: { label: "Giấy tờ", icon: FileText, emoji: "📄" },
  clothing: { label: "Quần áo", icon: Shirt, emoji: "👕" },
  toiletries: { label: "Vệ sinh cá nhân", icon: Droplets, emoji: "🧴" },
  electronics: { label: "Điện tử", icon: Smartphone, emoji: "📱" },
  medicine: { label: "Thuốc & Y tế", icon: Pill, emoji: "💊" },
  misc: { label: "Khác", icon: Package, emoji: "📦" },
};

interface Props {
  items: PackingItem[];
}

const PackingList = ({ items: initialItems }: Props) => {
  const [items, setItems] = useState(initialItems);
  const [expanded, setExpanded] = useState(true);

  const toggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  // Group by category
  const grouped = items.reduce<Record<string, PackingItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎒</span>
          <div className="text-left">
            <h3 className="font-display font-bold text-foreground">Checklist chuẩn bị đồ</h3>
            <p className="text-xs text-muted-foreground">{checkedCount}/{items.length} món đã chuẩn bị</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-bold text-chip-orange">{progress}%</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {Object.entries(grouped).map(([category, catItems]) => {
                const config = categoryConfig[category] || categoryConfig.misc;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{config.emoji}</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{config.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {catItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm ${
                            item.checked
                              ? "bg-chip-yellow-light/50 text-muted-foreground line-through"
                              : "bg-muted/30 hover:bg-muted/50 text-foreground"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            item.checked ? "bg-chip-orange border-chip-orange" : "border-border"
                          }`}>
                            {item.checked && <Check className="w-3 h-3 text-accent-foreground" />}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PackingList;
