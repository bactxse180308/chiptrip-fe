import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Wallet, Star, Bookmark, Share2, Crown, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { generateTrip, saveTrip, type TripPlan, type TripItem } from "@/lib/trip-data";

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [saved, setSaved] = useState(false);

  // Use passed trip or generate default
  const trip: TripPlan = state?.trip || generateTrip("Đà Nẵng", "2026-03-15", "2026-03-17", 3, []);

  const handleSave = () => {
    saveTrip(trip);
    setSaved(true);
    toast.success("Đã lưu kế hoạch!", {
      description: "Xem lại trong \"Chuyến đi của tôi\"",
      action: { label: "Xem ngay", onClick: () => navigate("/saved") },
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: trip.title,
      text: `Xem lịch trình ${trip.title} trên Chip Trip! 🐥`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast.success("Đã sao chép link!");
      }
    } catch {
      // User cancelled share
    }
  };

  const handleItemClick = (item: TripItem) => {
    navigate("/location", { state: { item } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left - Map (40%) */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-card h-[70vh]">
                  <iframe
                    title="Bản đồ lịch trình"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(trip.destination + " du lịch")}&zoom=12`}
                  />
                </div>
              </div>
            </div>

            {/* Right - Timeline (60%) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{trip.title} 🏖️</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {trip.duration}</span>
                      <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> {trip.totalCost} VNĐ</span>
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-chip-yellow" /> {trip.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="soft" size="sm" onClick={handleShare}><Share2 className="w-4 h-4" /></Button>
                    <Button
                      variant={saved ? "soft" : "hero"}
                      size="sm"
                      onClick={handleSave}
                      disabled={saved}
                    >
                      {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      {saved ? "Đã lưu" : "Lưu kế hoạch"}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              {trip.days.map((day, dayIdx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIdx * 0.15 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-accent">
                      <span className="text-sm font-bold text-accent-foreground">{day.day}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{day.date}</span>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-chip-orange/20 ml-4">
                    {day.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleItemClick(item)}
                        className="relative flex gap-4 bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-warm transition-all ml-4 cursor-pointer hover:-translate-y-0.5"
                      >
                        <div className="absolute -left-[1.6rem] top-5 w-3 h-3 rounded-full bg-chip-orange border-2 border-background" />
                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-chip-orange">{item.time}</span>
                          </div>
                          <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-foreground">{item.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upsell banner after day 1 */}
                  {dayIdx === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-warm rounded-2xl p-5 border border-chip-yellow/30 ml-8"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
                          <Crown className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">Mở khóa Premium ✨</p>
                          <p className="text-xs text-muted-foreground">AI đề xuất chính xác quán ăn 5 sao với giá ẩn!</p>
                        </div>
                        <Button variant="hero" size="sm">Nâng cấp</Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
