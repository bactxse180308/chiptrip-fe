import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock, Check, Shield } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const planDetails: Record<string, { name: string; price: string; period: string; features: string[] }> = {
  premium: {
    name: "Premium",
    price: "79,000",
    period: "/tháng",
    features: ["Không giới hạn lượt AI", "Đề xuất thay thế thông minh", "Lịch trình chi tiết", "Export PDF + Ảnh", "Bảo hiểm du lịch giảm 20%"],
  },
  pro: {
    name: "Pro Traveler",
    price: "199,000",
    period: "/tháng",
    features: ["Tất cả Premium", "Đề xuất khách sạn + deal ẩn", "Hỗ trợ 24/7", "Chia sẻ lịch trình nhóm", "Early access tính năng mới"],
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get("plan") || "premium";
  const plan = planDetails[planKey] || planDetails.premium;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success(`Đã nâng cấp lên ${plan.name} thành công! 🎉`);
      navigate("/premium");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-5 gap-8"
          >
            {/* Payment Form */}
            <div className="md:col-span-3 space-y-6">
              <button
                onClick={() => navigate("/premium")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại chọn gói
              </button>

              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Thanh toán</h1>
                <p className="text-muted-foreground text-sm mt-1">Nhập thông tin thẻ để nâng cấp gói {plan.name}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-semibold font-display">
                    <CreditCard className="w-5 h-5 text-chip-orange" />
                    Thông tin thẻ
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Tên trên thẻ</Label>
                    <Input
                      id="name"
                      placeholder="NGUYEN VAN A"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      required
                      className="uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card">Số thẻ</Label>
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      required
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Ngày hết hạn</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        required
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Thanh toán {plan.price}đ
                    </span>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Thanh toán được bảo mật bởi SSL 256-bit
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-5 space-y-4 sticky top-24">
                <h3 className="font-display font-bold text-foreground">Tóm tắt đơn hàng</h3>

                <div className="bg-chip-yellow-light rounded-xl p-4 space-y-1">
                  <p className="font-display font-bold text-foreground">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gradient">{plan.price}đ</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-chip-orange flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gói {plan.name}</span>
                    <span className="text-foreground">{plan.price}đ</span>
                  </div>
                  <div className="flex justify-between font-bold font-display">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-gradient">{plan.price}đ</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tự động gia hạn mỗi tháng. Hủy bất cứ lúc nào.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
