import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getSavedTrips, deleteTrip, renameTrip, type TripPlan } from "@/lib/trip-data";
import tripDanang from "@/assets/trip-danang.jpg";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SavedPlans = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    setTrips(getSavedTrips());
  }, []);

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setTrips(getSavedTrips());
    toast.success("Đã xóa chuyến đi");
  };

  const handleRenameStart = (trip: TripPlan) => {
    setEditingId(trip.id);
    setEditValue(trip.title);
  };

  const handleRenameConfirm = () => {
    if (editingId && editValue.trim()) {
      renameTrip(editingId, editValue.trim());
      setTrips(getSavedTrips());
      toast.success("Đã đổi tên chuyến đi");
    }
    setEditingId(null);
  };

  const getImage = (trip: TripPlan) => {
    return trip.image || trip.days?.[0]?.items?.[0]?.image || tripDanang;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">Chuyến đi của tôi 🐥</h1>
              <p className="text-muted-foreground mt-1">{trips.length} kế hoạch đã lưu</p>
            </div>
            <Link to="/planning">
              <Button variant="hero" size="default">
                <Plus className="w-4 h-4" /> Tạo chuyến mới
              </Button>
            </Link>
          </motion.div>

          {trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <span className="text-6xl">🗺️</span>
              <p className="text-muted-foreground text-lg">Chưa có chuyến đi nào được lưu</p>
              <Link to="/planning">
                <Button variant="hero">Tạo chuyến đi đầu tiên</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {trips.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={getImage(trip)}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        {trip.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {/* Title with rename */}
                      {editingId === trip.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()}
                            className="flex-1 h-8 px-2 rounded-lg border border-chip-orange bg-background text-foreground text-sm font-semibold focus:outline-none"
                            autoFocus
                          />
                          <button onClick={handleRenameConfirm} className="p-1 rounded-md hover:bg-muted text-chip-orange">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-foreground flex-1 truncate">{trip.title}</h3>
                          <button onClick={() => handleRenameStart(trip)} className="p-1 rounded-md hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{trip.dateRange}</span>
                        <span className="ml-auto font-semibold text-chip-orange">{trip.totalCost}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="soft"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate("/result", { state: { trip } })}
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem lại
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa chuyến đi?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa "{trip.title}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(trip.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPlans;
