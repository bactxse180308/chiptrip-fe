import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, User, Zap } from "lucide-react";
import { getCredits } from "@/lib/trip-data";

const Navbar = () => {
  const location = useLocation();
  const credits = getCredits();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Chip<span className="text-gradient">Trip</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Credits badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-chip-yellow-light border border-chip-yellow/30">
            <Zap className="w-3.5 h-3.5 text-chip-orange" />
            <span className="text-xs font-bold text-foreground">{credits}</span>
            <span className="text-xs text-muted-foreground">lượt AI</span>
          </div>

          <Link to="/saved">
            <Button variant="ghost" size="sm" className={location.pathname === "/saved" ? "bg-chip-yellow-light" : ""}>
              Chuyến đi của tôi
            </Button>
          </Link>
          <Button variant="soft" size="sm">
            <User className="w-4 h-4" />
            Đăng nhập
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
