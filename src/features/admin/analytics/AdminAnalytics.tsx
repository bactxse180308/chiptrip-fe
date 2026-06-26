import { motion } from "framer-motion";
import {
  Users, Plane, BrainCircuit, DollarSign, Globe,
  Heart, MessageCircle, Star, ShoppingCart, CreditCard,
  Loader2, TrendingUp, BarChart3, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useAdminAnalytics } from "./useAdminAnalytics";

/* ── Chart palette: 2 brand hues (ember, gold) + neutrals, kept restrained ── */
const COLOR = {
  ember: "hsl(var(--chip-orange))",
  gold: "hsl(var(--chip-yellow))",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
  privateSlice: "hsl(var(--muted-foreground) / 0.30)",
} as const;

const TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 13,
} as const;

/** Rút gọn VNĐ cho trục: 1.200.000 → "1,2tr", 200.000 → "200k". */
function vndShort(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
}

const mmdd = (v: string) => v.slice(5);

interface KpiCard {
  label: string;
  value: string;
  icon: React.ElementType;
  tone?: "ember" | "gold";
}

/* ── Reusable chart surface — keeps every panel on the same rhythm ── */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  className?: string;
  loading?: boolean;
  empty?: boolean;
  emptyHint?: string;
  children: React.ReactNode;
}

const ChartCard = ({
  title, subtitle, icon: Icon, className = "", loading, empty, emptyHint, children,
}: ChartCardProps) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ease: [0.22, 1, 0.36, 1] }}
    className={`admin-card p-5 sm:p-6 flex flex-col ${className}`}
  >
    <header className="flex items-start gap-3 mb-5">
      {Icon && (
        <span className="admin-icon-chip !w-9 !h-9 !rounded-xl shrink-0" data-tone="ember">
          <Icon className="w-4 h-4" />
        </span>
      )}
      <div className="leading-tight">
        <h3 className="admin-title text-base text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </header>
    <div className="flex-1 min-h-[220px] flex items-center justify-center">
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      ) : empty ? (
        <p className="text-sm text-muted-foreground text-center px-4">{emptyHint || "Chưa có dữ liệu"}</p>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  </motion.section>
);

const AdminAnalytics = () => {
  const {
    dashboard, trend, revenue, ordersVsTrips, aiCalls, publishSplit,
    pageviews, events, funnel, loading, postHogLoading,
  } = useAdminAnalytics();

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const kpis: KpiCard[] = dashboard
    ? [
        { label: "Tổng người dùng", value: dashboard.totalUsers.toLocaleString("vi-VN"), icon: Users, tone: "ember" },
        { label: "Tổng chuyến đi", value: dashboard.totalTrips.toLocaleString("vi-VN"), icon: Plane, tone: "ember" },
        { label: "AI calls tháng này", value: dashboard.aiCallsThisMonth.toLocaleString("vi-VN"), icon: BrainCircuit, tone: "ember" },
        { label: "Chi phí AI (USD)", value: `$${Number(dashboard.aiCostUsdThisMonth).toFixed(2)}`, icon: DollarSign, tone: "gold" },
        { label: "Trip công khai", value: (dashboard.publishedTrips ?? 0).toLocaleString("vi-VN"), icon: Globe },
        { label: "Likes", value: (dashboard.totalLikes ?? 0).toLocaleString("vi-VN"), icon: Heart },
        { label: "Comments", value: (dashboard.totalComments ?? 0).toLocaleString("vi-VN"), icon: MessageCircle },
        { label: "Reviews", value: (dashboard.totalReviews ?? 0).toLocaleString("vi-VN"), icon: Star },
        { label: "Orders", value: (dashboard.totalOrders ?? 0).toLocaleString("vi-VN"), icon: ShoppingCart, tone: "gold" },
        { label: "Doanh thu tháng (VND)", value: `${Number(dashboard.revenueVndThisMonth ?? 0).toLocaleString("vi-VN")}`, icon: CreditCard, tone: "gold" },
      ]
    : [];

  const publishTotal = publishSplit.reduce((s, x) => s + x.value, 0);

  return (
    <div className="space-y-8">
      {/* ── KPI overview ──────────────────────────────────────── */}
      <section>
        <p className="admin-eyebrow mb-3">Chỉ số tổng quan</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {kpis.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.32), ease: [0.22, 1, 0.36, 1] }}
              className="admin-card admin-card-hover admin-card-keyline p-4 sm:p-5"
            >
              <span className="admin-icon-chip mb-3" data-tone={stat.tone}>
                <stat.icon className="w-5 h-5" />
              </span>
              <p className="admin-stat-num text-2xl sm:text-3xl text-foreground break-words">{stat.value}</p>
              <p className="admin-eyebrow mt-2 !text-[0.6rem]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Primary charts ────────────────────────────────────── */}
      <section>
        <p className="admin-eyebrow mb-3">Doanh thu & vận hành · 30 ngày</p>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* Revenue area — the headline */}
          <ChartCard
            title="Doanh thu theo ngày"
            subtitle="Tổng tiền đơn đã thanh toán (VNĐ)"
            icon={TrendingUp}
            className="lg:col-span-4"
            loading={loading}
            empty={revenue.length === 0}
            emptyHint="Chưa có đơn hàng nào được thanh toán trong 30 ngày qua"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenue} margin={{ left: 4, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLOR.ember} stopOpacity={0.55} />
                    <stop offset="55%" stopColor={COLOR.gold} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={COLOR.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={mmdd} tick={{ fontSize: 11 }} stroke={COLOR.axis} />
                <YAxis tickFormatter={vndShort} tick={{ fontSize: 11 }} stroke={COLOR.axis} width={48} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(v) => `Ngày ${v}`}
                  formatter={(v: number) => [`${Number(v).toLocaleString("vi-VN")} ₫`, "Doanh thu"]}
                />
                <Area
                  type="monotone" dataKey="revenueVnd" name="Doanh thu"
                  stroke={COLOR.ember} strokeWidth={2} fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Public vs Private donut */}
          <ChartCard
            title="Chuyến đi công khai"
            subtitle="Tỉ lệ công khai / riêng tư"
            icon={Globe}
            className="lg:col-span-2"
            loading={loading}
            empty={publishTotal === 0}
            emptyHint="Chưa có chuyến đi nào"
          >
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={publishSplit} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={62} outerRadius={92}
                    paddingAngle={2} stroke="none"
                  >
                    <Cell fill={COLOR.ember} />
                    <Cell fill={COLOR.privateSlice} />
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number, n) => [`${Number(v).toLocaleString("vi-VN")} chuyến`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="admin-stat-num text-2xl text-foreground">
                  {publishTotal > 0 ? Math.round((publishSplit[0].value / publishTotal) * 100) : 0}%
                </span>
                <span className="admin-eyebrow !text-[0.55rem] mt-0.5">Công khai</span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {publishSplit.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: i === 0 ? COLOR.ember : COLOR.privateSlice }}
                  />
                  <span className="text-muted-foreground flex-1">{s.name}</span>
                  <span className="font-semibold text-foreground">{s.value.toLocaleString("vi-VN")}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Orders vs Trips composed */}
          <ChartCard
            title="Đơn hàng & Chuyến đi"
            subtitle="Số chuyến tạo mới (cột) so với đơn thanh toán (đường)"
            icon={BarChart3}
            className="lg:col-span-3"
            loading={loading}
            empty={ordersVsTrips.length === 0}
            emptyHint="Chưa có dữ liệu chuyến đi hoặc đơn hàng"
          >
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={ordersVsTrips} margin={{ left: 4, right: 8, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={mmdd} tick={{ fontSize: 11 }} stroke={COLOR.axis} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke={COLOR.axis} width={32} allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke={COLOR.axis} width={32} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={(v) => `Ngày ${v}`} />
                <Bar yAxisId="left" dataKey="trips" name="Chuyến đi" fill={COLOR.ember} radius={[4, 4, 0, 0]} maxBarSize={26} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Đơn hàng" stroke={COLOR.gold} strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* AI calls bar */}
          <ChartCard
            title="Lượt gọi AI theo ngày"
            subtitle="Số lần sinh lịch trình bằng AI"
            icon={BrainCircuit}
            className="lg:col-span-3"
            loading={loading}
            empty={aiCalls.length === 0}
            emptyHint="Chưa có lượt gọi AI nào trong 30 ngày qua"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={aiCalls} margin={{ left: 4, right: 8, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={mmdd} tick={{ fontSize: 11 }} stroke={COLOR.axis} />
                <YAxis tick={{ fontSize: 11 }} stroke={COLOR.axis} width={32} allowDecimals={false} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(v) => `Ngày ${v}`}
                  formatter={(v: number) => [`${v} lượt`, "Gọi AI"]}
                />
                <Bar dataKey="calls" name="Gọi AI" fill={COLOR.gold} radius={[4, 4, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* ── Behavioural analytics (PostHog + growth) ──────────── */}
      <section>
        <p className="admin-eyebrow mb-3">Phân tích hành vi</p>
        <div className="grid grid-cols-1 gap-5">
          {/* Growth trend */}
          <ChartCard
            title="Đăng ký & Chuyến đi"
            subtitle="Xu hướng tăng trưởng 30 ngày gần nhất"
            icon={Activity}
            loading={loading}
            empty={trend.length === 0}
            emptyHint="Chưa có dữ liệu tăng trưởng"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend} margin={{ left: 4, right: 8, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={mmdd} tick={{ fontSize: 11 }} stroke={COLOR.axis} />
                <YAxis tick={{ fontSize: 11 }} stroke={COLOR.axis} width={32} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={(v) => `Ngày ${v}`} />
                <Line type="monotone" dataKey="registrations" name="Đăng ký" stroke={COLOR.ember} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="trips" name="Chuyến đi" stroke={COLOR.gold} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Funnel */}
          <ChartCard
            title="Funnel chuyển đổi · 30 ngày"
            subtitle="Số người dùng đạt mỗi bước — nguồn PostHog"
            icon={BarChart3}
            loading={postHogLoading}
            empty={!funnel.some((f) => f.value > 0)}
            emptyHint="Chưa có dữ liệu funnel — kiểm tra backend đã cấu hình POSTHOG_PERSONAL_KEY (phx_…) và có event."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Funnel dataKey="value" data={funnel} isAnimationActive>
                    <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" className="text-[11px]" />
                    <LabelList position="left" fill={COLOR.axis} stroke="none" dataKey="value" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {funnel.map((f, i) => {
                  const base = funnel[0]?.value || 1;
                  const pct = Math.round((f.value / base) * 100);
                  return (
                    <div key={f.name} className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.fill }} />
                      <span className="text-sm text-foreground flex-1">{i + 1}. {f.name}</span>
                      <span className="text-sm font-semibold text-foreground">{f.value.toLocaleString("vi-VN")}</span>
                      <span className="text-xs text-muted-foreground w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartCard>

          {/* Pageviews + Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard
              title="Lượt xem trang · 14 ngày"
              subtitle="$pageview theo ngày — PostHog"
              icon={Activity}
              loading={postHogLoading}
              empty={pageviews.length === 0}
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={pageviews} margin={{ left: 4, right: 8, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke={COLOR.axis} />
                  <YAxis tick={{ fontSize: 11 }} stroke={COLOR.axis} width={32} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="count" name="Lượt xem" stroke={COLOR.ember} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Sự kiện theo loại · 30 ngày"
              subtitle="Tổng số lần phát sinh mỗi event — PostHog"
              icon={BarChart3}
              loading={postHogLoading}
              empty={events.length === 0}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={events} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.grid} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke={COLOR.axis} allowDecimals={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} stroke={COLOR.axis} width={120} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" name="Số lần" fill={COLOR.ember} radius={[0, 4, 4, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;
