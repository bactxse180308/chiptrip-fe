import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import {
  Sparkles, MapPin, Wallet, Map as MapIcon, Luggage, Ticket, Share2,
  SlidersHorizontal, ArrowRight, ArrowDown, Star, Quote, Plane, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import tripDanang from "@/assets/trip-danang.jpg";
import tripSapa from "@/assets/trip-sapa.jpg";
import tripPhuquoc from "@/assets/trip-phuquoc.jpg";
import tripHoian from "@/assets/trip-hoian.jpg";
import tripHalong from "@/assets/trip-halong.jpg";
import tripDalat from "@/assets/trip-dalat.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, DrawSVGPlugin, MotionPathPlugin, SplitText);

/* ── content ─────────────────────────────────────────────── */

const heroStops = [
  { time: "08:30", title: "Biển Mỹ Khê", note: "Đón bình minh" },
  { time: "11:30", title: "Bún chả cá Bà Lữ", note: "Đặc sản" },
  { time: "15:00", title: "Bà Nà · Cầu Vàng", note: "Check-in" },
  { time: "19:30", title: "Cầu Rồng phun lửa", note: "Cuối tuần" },
];

const heroStats = [
  { v: "500+", l: "địa điểm" },
  { v: "10K+", l: "chuyến đi" },
  { v: "~70%", l: "tiết kiệm" },
  { v: "30s", l: "mỗi lịch trình" },
];

const marquee = [
  "Hà Giang", "Hội An", "Ninh Bình", "Quy Nhơn", "Mộc Châu", "Cát Bà",
  "Côn Đảo", "Huế", "Nha Trang", "Cao Bằng", "Phong Nha", "Tây Ninh",
];

const steps = [
  { n: "01", icon: MapPin, title: "Chọn điểm đến & ngày", desc: "Nhập thành phố bạn muốn đến và số ngày rảnh." },
  { n: "02", icon: SlidersHorizontal, title: "Đặt ngân sách & gu đi", desc: "Kéo thanh chi phí, chọn vibe: biển, ẩm thực, chữa lành…" },
  { n: "03", icon: Sparkles, title: "AI dựng lịch trình", desc: "Lịch theo từng khung giờ, kèm chi phí, quán ăn và đường đi." },
];

const destinations = [
  { name: "Đà Nẵng", region: "Miền Trung", days: "3N2Đ", price: "~3tr", vibe: "Biển & ẩm thực", image: tripDanang, feature: true },
  { name: "Hội An", region: "Quảng Nam", days: "2N1Đ", price: "~2tr", vibe: "Phố cổ đèn lồng", image: tripHoian },
  { name: "Sa Pa", region: "Lào Cai", days: "3N2Đ", price: "~4tr", vibe: "Núi & biển mây", image: tripSapa },
  { name: "Phú Quốc", region: "Kiên Giang", days: "4N3Đ", price: "~5tr", vibe: "Đảo & nghỉ dưỡng", image: tripPhuquoc },
  { name: "Hạ Long", region: "Quảng Ninh", days: "3N2Đ", price: "~2,5tr", vibe: "Vịnh di sản", image: tripHalong },
  { name: "Đà Lạt", region: "Lâm Đồng", days: "3N2Đ", price: "~3tr", vibe: "Thông & sương", image: tripDalat },
];

const features = [
  { icon: Sparkles, title: "AI hiểu gu của bạn", desc: "Tối ưu theo sở thích và ngân sách — không phải lịch trình rập khuôn." },
  { icon: Wallet, title: "Biết trước chi phí", desc: "Dự toán từng hoạt động, tổng chi minh bạch trước khi lên đường." },
  { icon: MapIcon, title: "Đường đi trực quan", desc: "Toàn bộ điểm đến trên bản đồ, tối ưu quãng đường mỗi ngày." },
  { icon: Luggage, title: "Checklist hành lý", desc: "Gợi ý đồ cần mang dựa trên điểm đến và thời tiết thực tế." },
  { icon: Ticket, title: "Đặt chỗ nhanh", desc: "Link đặt phòng, vé tham quan ngay trong từng khung giờ." },
  { icon: Share2, title: "Chia sẻ & rủ rê", desc: "Xuất PDF, ảnh đẹp hoặc link để rủ cả nhóm cùng đi." },
];

const testimonials = [
  { name: "Minh Anh", role: "Freelancer · Đà Lạt", initials: "MA", text: "Tiết kiệm cả buổi research. Lịch trình Đà Lạt chuẩn từng khung giờ luôn.", accent: "orange" },
  { name: "Hà Linh", role: "Sinh viên · Sa Pa", initials: "HL", text: "Plan chuyến Sa Pa cho 6 người chỉ trong 5 phút. Quá xịn so với tự làm!", accent: "teal" },
  { name: "Đức Phong", role: "Văn phòng · Đà Nẵng", initials: "ĐP", text: "Gợi ý quán ăn chính xác. Đi Đà Nẵng về mà vẫn nhớ mãi con ghẹ.", accent: "yellow" },
];

/* ── duck mascot (vector, on-brand) ──────────────────────── */

const ChipDuck = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <ellipse cx="28" cy="42" rx="20" ry="15" fill="hsl(var(--chip-yellow))" />
    <path d="M12 44q16 13 32 0-2 12-16 12T12 44Z" fill="hsl(var(--chip-orange))" opacity="0.18" />
    <circle cx="42" cy="26" r="13" fill="hsl(var(--chip-yellow))" />
    <path d="M53 23l9-2q1 4-2 7l-7-1Z" fill="hsl(var(--chip-orange))" />
    <circle cx="45" cy="24" r="2.4" fill="#23170c" />
    <circle cx="45.8" cy="23.2" r="0.7" fill="#fff" />
  </svg>
);

/* ── stat / data pill ────────────────────────────────────── */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-chip-teal-ink/80 flex items-center gap-2">
    <span className="inline-block w-5 h-px bg-chip-teal" />
    {children}
  </span>
);

const Index = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { motion, isDesktop } = ctx.conditions as {
            motion: boolean; reduce: boolean; isDesktop: boolean;
          };

          /* hero flight arc — always drawn; plane parks at destination */
          if (!motion) {
            gsap.set("#hero-plane", { motionPath: { path: "#hero-arc", align: "#hero-arc", alignOrigin: [0.5, 0.5], start: 1, end: 1 } });
            return; // reduced-motion users get the page in its final, calm state
          }

          /* ── hero entrance timeline ── */
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          const split = SplitText.create(".hero-title", { type: "lines", mask: "lines", linesClass: "leading-[1.05]" });
          tl.from(split.lines, { yPercent: 115, duration: 0.9, stagger: 0.12 }, 0.1)
            .from(".hero-eyebrow", { opacity: 0, y: 14, duration: 0.5 }, 0.1)
            .from(".hero-sub", { opacity: 0, y: 18, duration: 0.6 }, 0.45)
            .from(".hero-cta", { opacity: 0, y: 18, duration: 0.6 }, 0.6)
            .from(".hero-stat", { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 }, 0.7)
            .from(".hero-ticket", { opacity: 0, y: 30, rotate: 1.5, duration: 0.9 }, 0.35)
            .from(".hero-underline", { drawSVG: 0, duration: 0.8, ease: "power2.inOut" }, 0.9);

          /* draw the flight arc, then fly the plane along it */
          tl.from("#hero-arc", { drawSVG: 0, duration: 1, ease: "power1.inOut" }, 0.7)
            .to("#hero-plane", {
              motionPath: { path: "#hero-arc", align: "#hero-arc", alignOrigin: [0.5, 0.5], autoRotate: 90 },
              duration: 1.6, ease: "power1.inOut",
            }, 0.8)
            .from(".hero-stop", { opacity: 0, x: -14, stagger: 0.12, duration: 0.45 }, 1.0);

          /* ── scroll reveals — one trigger per element so nothing can be
             stranded half-faded; `once` shows the final state if already
             scrolled past, `clearProps` frees CSS hover transforms after. ── */
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "opacity,transform",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });

          /* fonts/images can shift layout → recompute trigger positions */
          if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

          /* ── the route spine: draws + duck travels as you scroll (desktop) ── */
          if (isDesktop) {
            const wrapper = root.current!.querySelector<HTMLElement>(".journey")!;
            const duck = root.current!.querySelector<HTMLElement>(".route-duck")!;
            const setDuckY = gsap.quickSetter(duck, "y", "px");
            const setDuckX = gsap.quickSetter(duck, "x", "px");

            gsap.fromTo(
              "#route-draw",
              { drawSVG: "0%" },
              {
                drawSVG: "100%", ease: "none",
                scrollTrigger: { trigger: wrapper, start: "top 65%", end: "bottom 75%", scrub: 0.6 },
              }
            );

            ScrollTrigger.create({
              trigger: wrapper, start: "top 65%", end: "bottom 75%", scrub: 0.6,
              onUpdate: (self) => {
                const h = wrapper.clientHeight - 64;
                setDuckY(self.progress * h);
                setDuckX(Math.sin(self.progress * Math.PI * 3) * 9);
              },
            });
          }
        }
      );
    },
    { scope: root }
  );

  const scrollToDemo = () =>
    gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: "#kham-pha", offsetY: 72 } });

  return (
    <div ref={root} className="min-h-screen bg-paper text-foreground overflow-x-clip">
      <Navbar />

      <main>
      {/* ───────── Hero ───────── */}
      <section className="relative pt-28 pb-16 sm:pt-32 lg:pt-36 bg-sun-glow">
        <div className="container mx-auto px-5 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
          {/* left — thesis */}
          <div className="relative z-10">
            <div className="hero-eyebrow mb-6">
              <Eyebrow>Trợ lý du lịch AI · Việt Nam</Eyebrow>
            </div>

            <h1 className="hero-title font-display font-bold text-foreground text-[2.7rem] sm:text-6xl lg:text-[4.2rem] leading-[1.05] tracking-tight">
              Chọn nơi đến.
              <br />
              Nhận cả{" "}
              <span className="relative inline-block text-chip-orange-ink">
                hành trình
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path className="hero-underline" d="M3 9C40 4 90 3 130 6s60 4 87 1" stroke="hsl(var(--chip-yellow))" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>

            <p className="hero-sub mt-7 text-lg text-muted-foreground max-w-md leading-relaxed">
              Lịch trình theo từng khung giờ — kèm chi phí, quán ăn và đường đi.
              Dựng trong 30 giây bằng AI, thay cho 20 tab Google đang mở.
            </p>

            <div className="hero-cta mt-8 flex flex-wrap items-center gap-3">
              <Link to="/planning">
                <Button variant="hero" size="xl">
                  <Sparkles className="w-5 h-5" />
                  Tạo lịch trình miễn phí
                </Button>
              </Link>
              <button
                onClick={scrollToDemo}
                className="group inline-flex items-center gap-2 px-5 py-4 rounded-2xl font-display font-semibold text-foreground border border-border hover:border-chip-teal hover:text-chip-teal-ink transition-colors"
              >
                Xem điểm đến
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            <dl className="mt-10 grid grid-cols-4 gap-3 max-w-md border-t border-dashed border-border pt-6">
              {heroStats.map((s) => (
                <div key={s.l} className="hero-stat">
                  <dt className="font-data text-xl sm:text-2xl font-bold text-foreground">{s.v}</dt>
                  <dd className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right — the actual output: a boarding-pass itinerary */}
          <div className="hero-ticket relative">
            <div className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto bg-card rounded-[1.6rem] border border-border shadow-ticket">
              {/* stub */}
              <div className="p-5 pb-4">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-chip-teal-ink">
                    <ChipDuck className="w-4 h-4" /> Chip Trip
                  </span>
                  <span>Boarding Pass</span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] text-muted-foreground">FROM</p>
                    <p className="font-display text-2xl font-bold leading-none">SGN</p>
                  </div>
                  <svg viewBox="0 0 240 70" className="flex-1 h-12" fill="none" aria-hidden="true">
                    <path d="M18 56 Q120 -10 222 56" stroke="hsl(var(--chip-teal))" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" opacity="0.45" />
                    <path id="hero-arc" d="M18 56 Q120 -10 222 56" stroke="hsl(var(--chip-teal))" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="18" cy="56" r="4" fill="hsl(var(--chip-teal))" />
                    <circle cx="222" cy="56" r="4" fill="hsl(var(--chip-orange))" />
                    <g id="hero-plane">
                      <circle r="11" fill="hsl(var(--chip-orange))" />
                      <path d="M-5 0h7l3-3h2l-2 3 2 3h-2l-3-3h-7Z" fill="#fff" transform="rotate(90)" />
                    </g>
                  </svg>
                  <div className="text-right">
                    <p className="font-mono text-[11px] text-muted-foreground">TO</p>
                    <p className="font-display text-2xl font-bold leading-none text-chip-orange-ink">DAD</p>
                  </div>
                </div>
                <p className="mt-3 font-mono text-[11px] text-muted-foreground tracking-wide">ĐÀ NẴNG · NGÀY 1 / 3</p>
              </div>

              {/* perforation */}
              <div className="relative h-5 bg-card ticket-perf border-y border-dashed border-border">
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-paper" />
                <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-paper" />
              </div>

              {/* itinerary */}
              <div className="p-5 pt-4 space-y-1">
                {heroStops.map((s, i) => (
                  <div key={s.time} className="hero-stop flex items-start gap-3 py-2">
                    <span className="font-data text-sm font-bold text-chip-teal-ink w-12 shrink-0 pt-0.5">{s.time}</span>
                    <span className="relative shrink-0 mt-1.5">
                      <span className={`block w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-chip-orange" : "bg-chip-teal"}`} />
                      {i < heroStops.length - 1 && (
                        <span className="absolute left-1/2 top-3 -translate-x-1/2 w-px h-7 bg-border" />
                      )}
                    </span>
                    <div className="min-w-0 -mt-0.5">
                      <p className="font-semibold text-foreground text-[15px] leading-snug">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.note}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-border">
                  <div className="font-data text-[11px] tracking-wide text-muted-foreground">
                    3 NGÀY · <span className="text-foreground font-bold">~3.000.000đ</span>
                  </div>
                  <div className="flex gap-[3px] items-end h-6" aria-hidden="true">
                    {[5, 9, 4, 11, 6, 10, 3, 8, 5, 12, 4, 7].map((h, i) => (
                      <span key={i} className="w-[3px] bg-foreground/80" style={{ height: h * 2 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* floating note */}
            <div className="hidden sm:flex absolute -left-4 lg:-left-8 bottom-8 items-center gap-2 bg-card border border-border rounded-2xl px-3.5 py-2.5 shadow-card">
              <span className="w-8 h-8 rounded-xl bg-chip-teal-light flex items-center justify-center">
                <Clock className="w-4 h-4 text-chip-teal-ink" />
              </span>
              <div>
                <p className="font-data text-sm font-bold leading-none">30 giây</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">là xong lịch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Departures marquee ───────── */}
      <div className="border-y border-border/70 bg-card/40 py-3.5 overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="font-mono text-xs font-bold tracking-[0.18em] uppercase text-muted-foreground flex items-center gap-8">
              <Plane className="w-3.5 h-3.5 text-chip-teal" />
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ───────── Journey (route spine threads these) ───────── */}
      <div className="journey relative container mx-auto px-5 sm:px-6 py-20 sm:py-24">
        {/* route spine — desktop only */}
        <div className="route-lane pointer-events-none absolute left-0 top-0 bottom-0 w-16 hidden lg:block" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 1000" preserveAspectRatio="none" fill="none">
            <path d="M24 0C40 130 8 270 24 400S40 720 24 840 8 960 24 1000" stroke="hsl(var(--chip-teal))" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" opacity="0.35" />
            <path id="route-draw" d="M24 0C40 130 8 270 24 400S40 720 24 840 8 960 24 1000" className="route-stroke" opacity="0.9" />
          </svg>
          <div className="route-duck absolute left-1/2 -translate-x-1/2 top-0 w-9 h-9 rounded-full bg-card border border-chip-teal/40 shadow-card flex items-center justify-center">
            <ChipDuck className="w-6 h-6" />
          </div>
        </div>

        <div className="lg:pl-24 space-y-24 sm:space-y-28">
          {/* How it works */}
          <section>
            <div className="max-w-xl" data-reveal>
              <Eyebrow>Lộ trình 3 bước</Eyebrow>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Từ một cái tên thành phố <br className="hidden sm:block" />đến lịch trình chi tiết.
              </h2>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-5">
              {steps.map((s) => (
                <div key={s.n} data-reveal className="relative bg-card rounded-2xl border border-border p-6 hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-chip-teal-light flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-chip-teal-ink" />
                    </span>
                    <span aria-hidden="true" className="font-data text-2xl font-bold text-[#94857a] dark:text-white/25">{s.n}</span>
                  </div>
                  <h3 className="mt-4 font-display font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Destinations */}
          <section id="kham-pha" className="scroll-mt-24">
            <div className="flex items-end justify-between flex-wrap gap-4" data-reveal>
              <div>
                <Eyebrow>Điểm đến phổ biến</Eyebrow>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">Khám phá Việt Nam</h2>
              </div>
              <Link to="/planning" className="font-display font-semibold text-sm text-chip-teal-ink hover:text-chip-orange transition-colors inline-flex items-center gap-1.5">
                Tất cả điểm đến <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[15rem]">
              {destinations.map((d) => (
                <Link
                  key={d.name}
                  to="/planning"
                  data-reveal
                  className={`group relative rounded-2xl overflow-hidden shadow-card ${d.feature ? "sm:col-span-2 sm:row-span-2 sm:h-auto" : ""}`}
                >
                  <img
                    src={d.image}
                    alt={`${d.name}, ${d.region}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute top-3 left-3 font-mono text-[10px] font-bold tracking-widest uppercase text-white/85 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                    {d.region}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                    <h3 className={`font-display font-bold text-on-image-text ${d.feature ? "text-3xl" : "text-xl"}`}>{d.name}</h3>
                    <p className="text-on-image-text-muted/85 text-sm mt-0.5">{d.vibe}</p>
                    <div className="mt-2.5 flex items-center gap-2 font-data text-[11px] font-bold tracking-wide text-white/90">
                      <span className="bg-white/20 backdrop-blur-sm rounded px-2 py-0.5">{d.days}</span>
                      <span className="bg-chip-orange-ink rounded px-2 py-0.5">{d.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <div className="max-w-xl" data-reveal>
              <Eyebrow>Vì sao chọn Chip Trip</Eyebrow>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">Đủ thứ cho một chuyến đi trọn vẹn.</h2>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {features.map((f) => (
                <div key={f.title} data-reveal className="flex gap-4 py-5 border-b border-border/70">
                  <span className="shrink-0 w-11 h-11 rounded-xl bg-chip-orange/10 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-chip-orange-ink" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <div className="max-w-xl" data-reveal>
              <Eyebrow>Người đi nói gì</Eyebrow>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">Được 10K+ du khách tin dùng.</h2>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-5">
              {testimonials.map((t) => {
                const tone =
                  t.accent === "teal" ? "text-chip-teal-ink bg-chip-teal-light"
                  : t.accent === "yellow" ? "text-chip-warm bg-chip-yellow-light"
                  : "text-chip-orange-ink bg-chip-orange/10";
                return (
                  <figure key={t.name} data-reveal className="bg-card rounded-2xl border border-border p-6 flex flex-col">
                    <Quote className="w-7 h-7 text-chip-teal/30" />
                    <blockquote className="mt-3 text-[15px] text-foreground leading-relaxed flex-1">{t.text}</blockquote>
                    <div className="flex items-center gap-1 mt-4 mb-3" role="img" aria-label="5 trên 5 sao">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-chip-yellow text-chip-yellow" />
                      ))}
                    </div>
                    <figcaption className="flex items-center gap-3 pt-3 border-t border-dashed border-border">
                      <span className={`w-9 h-9 rounded-full grid place-items-center font-display font-bold text-sm ${tone}`}>{t.initials}</span>
                      <div>
                        <p className="font-semibold text-sm leading-none">{t.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground mt-1 tracking-wide">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ───────── Final CTA — boarding gate ───────── */}
      <section className="container mx-auto px-5 sm:px-6 pb-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] shadow-warm border border-border text-foreground
                     bg-gradient-to-br from-[#fff4e6] via-[#f3f8f6] to-[#e7f1f0]
                     dark:from-[#251813] dark:via-[#1a2422] dark:to-[#122120]"
        >
          {/* cartographer grid */}
          <div className="absolute inset-0 opacity-70" aria-hidden="true" style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.05) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--foreground) / 0.05) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
          {/* sunrise + map-ink glow */}
          <div className="absolute inset-0" aria-hidden="true" style={{
            background: "radial-gradient(42% 65% at 90% 4%, hsl(var(--chip-orange) / 0.30), transparent 62%), radial-gradient(40% 75% at 0% 100%, hsl(var(--chip-teal) / 0.22), transparent 60%)",
          }} />

          <div className="relative flex flex-col lg:flex-row">
            {/* message + action */}
            <div className="flex-1 p-8 sm:p-12 lg:p-14">
              <p className="font-mono text-[11px] font-bold tracking-[0.24em] uppercase text-chip-orange-ink flex items-center gap-2">
                <span className="inline-block w-5 h-px bg-chip-orange-ink" />
                Cửa lên máy bay đang mở
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.3rem] font-bold leading-[1.06]">
                Sẵn sàng lên đường?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
                Tạo lịch trình hoàn chỉnh trong 30 giây. Miễn phí, không cần thẻ — chỉ cần chọn điểm đến.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link to="/planning">
                  <Button size="xl" className="bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg">
                    <Sparkles className="w-5 h-5 text-chip-orange-ink" />
                    Bắt đầu ngay
                  </Button>
                </Link>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-chip-teal motion-safe:animate-pulse" />
                  10K+ CHUYẾN ĐÃ KHỞI HÀNH
                </div>
              </div>
            </div>

            {/* boarding-pass stub */}
            <div className="relative shrink-0 lg:w-[17rem] p-8 sm:p-10 lg:p-8 border-t lg:border-t-0 lg:border-l border-dashed border-foreground/20 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Boarding Pass</span>
                <span className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center">
                  <ChipDuck className="w-6 h-6" />
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">TỪ</p>
                  <p className="font-display text-lg font-bold leading-none">BẠN</p>
                </div>
                <svg viewBox="0 0 100 34" className="flex-1 h-7" fill="none" aria-hidden="true">
                  <path d="M8 24 Q50 -4 92 24" stroke="hsl(var(--chip-teal))" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" opacity="0.7" />
                  <circle cx="8" cy="24" r="3.2" fill="hsl(var(--chip-teal))" />
                  <circle cx="92" cy="24" r="3.2" fill="hsl(var(--chip-orange-ink))" />
                  <g transform="translate(50 10) rotate(28)"><path d="M-4 0h6l3-3h2l-2 3 2 3h-2l-3-3h-6Z" fill="hsl(var(--foreground))" /></g>
                </svg>
                <div className="text-right">
                  <p className="font-mono text-[10px] text-muted-foreground">ĐẾN</p>
                  <p className="font-display text-lg font-bold leading-none text-chip-orange-ink">VIỆT NAM</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-[11px]">
                <div><p className="text-muted-foreground">CỬA</p><p className="font-bold tracking-wide">CHIP·01</p></div>
                <div><p className="text-muted-foreground">GIỜ DỰNG</p><p className="font-bold tracking-wide">30 GIÂY</p></div>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex gap-[3px] items-end h-7" aria-hidden="true">
                  {[7, 12, 5, 14, 8, 11, 4, 10, 7, 13, 5, 9, 12, 6].map((h, i) => (
                    <span key={i} className="w-[3px] bg-foreground/80" style={{ height: h * 2 }} />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">CT-26</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-5 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
              <ChipDuck className="w-6 h-6" />
            </span>
            <span className="font-display font-bold text-lg">
              Chip<span className="text-gradient">Trip</span>
            </span>
          </Link>
          <p className="font-mono text-xs text-muted-foreground tracking-wide order-last sm:order-none">© 2026 CHIP TRIP · LÀM TẠI VIỆT NAM</p>
          <nav className="flex gap-5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-foreground transition-colors">Chính sách</a>
            <a href="#" className="hover:text-foreground transition-colors">Liên hệ</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
