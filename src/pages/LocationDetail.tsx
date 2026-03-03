import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Clock, Wallet, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { TripItem } from "@/lib/trip-data";

const LocationDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item as TripItem | undefined;

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Không tìm thấy thông tin địa điểm</p>
          <Button variant="hero" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        {/* Hero image */}
        <div className="relative h-[40vh] overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <Button
            variant="soft"
            size="sm"
            className="absolute top-24 left-6 bg-background/80 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Button>
        </div>

        <div className="container mx-auto px-6 -mt-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-6 max-w-2xl mx-auto"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
              <p className="text-muted-foreground mt-1">{item.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Clock className="w-5 h-5 text-chip-orange" />
                <div>
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                  <p className="font-semibold text-foreground">{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Wallet className="w-5 h-5 text-chip-orange" />
                <div>
                  <p className="text-xs text-muted-foreground">Chi phí</p>
                  <p className="font-semibold text-foreground">{item.cost}</p>
                </div>
              </div>
              {item.rating && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Star className="w-5 h-5 text-chip-yellow" />
                  <div>
                    <p className="text-xs text-muted-foreground">Đánh giá</p>
                    <p className="font-semibold text-foreground">{item.rating}/5</p>
                  </div>
                </div>
              )}
              {item.address && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <MapPin className="w-5 h-5 text-chip-orange" />
                  <div>
                    <p className="text-xs text-muted-foreground">Địa chỉ</p>
                    <p className="font-semibold text-foreground text-sm">{item.address}</p>
                  </div>
                </div>
              )}
            </div>

            {item.tips && (
              <div className="flex gap-3 p-4 rounded-xl bg-chip-yellow-light border border-chip-yellow/20">
                <Lightbulb className="w-5 h-5 text-chip-orange flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Mẹo du lịch</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.tips}</p>
                </div>
              </div>
            )}

            <Button variant="hero" className="w-full" onClick={() => {
              if (item.address) {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`, "_blank");
              }
            }}>
              <MapPin className="w-4 h-4" /> Xem trên Google Maps
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
