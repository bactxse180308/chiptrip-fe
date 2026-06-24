import { type ElementType, type FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Package,
  Pill,
  Plus,
  Shirt,
  Smartphone,
  Trash2,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChecklistCategory, ChecklistDetail } from "@/integrations/api/types";
import {
  useAddChecklistItem,
  useDeleteChecklistItem,
  useToggleChecklistItem,
  useTripChecklist,
} from "@/hooks/useApi";

const categoryOrder: ChecklistCategory[] = [
  "PAPERS",
  "CLOTHES",
  "HYGIENE",
  "ELECTRONICS",
  "MEDICINE",
  "OTHER",
];

const categoryConfig: Record<ChecklistCategory, { label: string; icon: ElementType; emoji: string }> = {
  PAPERS: { label: "Giấy tờ", icon: FileText, emoji: "📄" },
  CLOTHES: { label: "Quần áo", icon: Shirt, emoji: "👕" },
  HYGIENE: { label: "Vệ sinh cá nhân", icon: Droplets, emoji: "🧴" },
  ELECTRONICS: { label: "Điện tử", icon: Smartphone, emoji: "📱" },
  MEDICINE: { label: "Thuốc & Y tế", icon: Pill, emoji: "💊" },
  OTHER: { label: "Khác", icon: Package, emoji: "📦" },
};

interface Props {
  tripId?: number | null;
  items: ChecklistDetail[];
  readOnly?: boolean;
}

function normalizeCategory(category: string | null | undefined): ChecklistCategory {
  return category && category in categoryConfig ? (category as ChecklistCategory) : "OTHER";
}

const PackingList = ({ tripId = null, items: initialItems, readOnly = false }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ChecklistCategory>("OTHER");

  const canEdit = !readOnly && tripId != null;
  const checklistQuery = useTripChecklist(tripId, canEdit);
  const addMutation = useAddChecklistItem(tripId);
  const toggleMutation = useToggleChecklistItem(tripId);
  const deleteMutation = useDeleteChecklistItem(tripId);

  const items = canEdit ? (checklistQuery.data ?? initialItems) : initialItems;
  const checkedCount = items.filter((item) => item.isChecked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  const grouped = useMemo(() => {
    return items.reduce<Record<ChecklistCategory, ChecklistDetail[]>>((acc, item) => {
      const category = normalizeCategory(item.category);
      acc[category].push(item);
      return acc;
    }, {
      PAPERS: [],
      CLOTHES: [],
      HYGIENE: [],
      ELECTRONICS: [],
      MEDICINE: [],
      OTHER: [],
    });
  }, [items]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.error("Nhập tên món cần chuẩn bị");
      return;
    }
    if (!canEdit) {
      toast.error("Không thể chỉnh checklist trong chế độ này");
      return;
    }

    try {
      await addMutation.mutateAsync({ name, category: newCategory });
      setNewName("");
      setNewCategory("OTHER");
      toast.success("Đã thêm vào checklist");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thêm checklist thất bại");
    }
  };

  const handleToggle = async (itemId: number) => {
    if (!canEdit) return;
    try {
      await toggleMutation.mutateAsync(itemId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật checklist thất bại");
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!canEdit) return;
    try {
      await deleteMutation.mutateAsync(itemId);
      toast.success("Đã xóa khỏi checklist");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Xóa checklist thất bại");
    }
  };

  const isMutating = addMutation.isPending || toggleMutation.isPending || deleteMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎒</span>
          <div className="text-left">
            <h3 className="font-display font-bold text-foreground">Checklist chuẩn bị đồ</h3>
            <p className="text-xs text-muted-foreground">
              {checklistQuery.isFetching && canEdit ? "Đang đồng bộ..." : `${checkedCount}/${items.length} món đã chuẩn bị`}
            </p>
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

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {canEdit && (
              <form onSubmit={handleAdd} className="grid grid-cols-1 gap-2 border-y border-border/60 px-5 py-4 sm:grid-cols-[1fr_180px_auto]">
                <Input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Thêm món cần chuẩn bị"
                  disabled={addMutation.isPending}
                />
                <Select
                  value={newCategory}
                  onValueChange={(value) => setNewCategory(normalizeCategory(value))}
                  disabled={addMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOrder.map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryConfig[category].emoji} {categoryConfig[category].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" variant="hero" className="gap-2" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Thêm
                </Button>
              </form>
            )}

            <div className="px-5 pb-5 pt-4 space-y-4">
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Chưa có món nào trong checklist.
                </div>
              )}

              {categoryOrder.map((category) => {
                const catItems = grouped[category];
                if (catItems.length === 0) return null;
                const config = categoryConfig[category];
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{config.emoji}</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{config.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                            item.isChecked
                              ? "bg-chip-yellow-light/50 text-muted-foreground"
                              : "bg-muted/30 text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggle(item.id)}
                            disabled={!canEdit || isMutating}
                            className={`h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all disabled:cursor-not-allowed ${
                              item.isChecked ? "bg-chip-orange border-chip-orange" : "border-border"
                            }`}
                            title={item.isChecked ? "Bỏ tick" : "Đánh dấu đã chuẩn bị"}
                          >
                            {item.isChecked && <Check className="w-3 h-3 text-accent-foreground" />}
                          </button>
                          <span className={`min-w-0 flex-1 ${item.isChecked ? "line-through" : ""}`}>{item.name}</span>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
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
