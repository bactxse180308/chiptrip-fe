import tripDanang from "@/assets/trip-danang.jpg";
import tripHoian from "@/assets/trip-hoian.jpg";
import tripSapa from "@/assets/trip-sapa.jpg";
import tripPhuquoc from "@/assets/trip-phuquoc.jpg";

export interface TripItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  cost: string;
  image: string;
  address?: string;
  rating?: number;
  tips?: string;
  bookingUrl?: string;
  bookingType?: "hotel" | "restaurant" | "attraction" | "transport" | "cafe";
}

export interface TripDay {
  day: string;
  date: string;
  items: TripItem[];
}

export interface TripPlan {
  id: string;
  destination: string;
  title: string;
  days: TripDay[];
  totalCost: string;
  rating: number;
  duration: string;
  image: string;
  tags: string[];
  dateRange: string;
}

export interface PackingItem {
  id: string;
  label: string;
  category: "clothing" | "toiletries" | "electronics" | "documents" | "medicine" | "misc";
  checked: boolean;
}

// --- Destinations data ---
const destinations: Record<string, TripDay[]> = {
  "đà nẵng": [
    {
      day: "Ngày 1", date: "",
      items: [
        { id: "dn1", time: "08:00", title: "Checkin khách sạn Mường Thanh", desc: "Nghỉ ngơi, chuẩn bị", cost: "800K", image: tripDanang, address: "270 Võ Nguyên Giáp, Đà Nẵng", rating: 4.5, tips: "Nên đặt phòng view biển để có trải nghiệm tốt nhất", bookingUrl: "https://www.traveloka.com/vi-vn/hotel/vietnam/area/da-nang-10187", bookingType: "hotel" },
        { id: "dn2", time: "10:30", title: "Tham quan Bà Nà Hills", desc: "Cầu Vàng, Fantasy Park", cost: "900K", image: tripDanang, address: "Bà Nà Hills, Hòa Ninh, Hòa Vang", rating: 4.8, tips: "Nên đi sớm để tránh đông, mang áo ấm vì trên núi lạnh", bookingUrl: "https://www.klook.com/vi/activity/1915-ba-na-hills-day-trip-da-nang/", bookingType: "attraction" },
        { id: "dn3", time: "12:30", title: "Ăn trưa hải sản Mỹ Khê", desc: "Quán bà Tư - Đặc sản ghẹ hấp", cost: "350K", image: tripHoian, address: "Bãi biển Mỹ Khê, Đà Nẵng", rating: 4.3, tips: "Ghẹ hấp bia là món signature, nên gọi thêm ốc hương", bookingType: "restaurant" },
        { id: "dn4", time: "15:00", title: "Uống cafe Son Trà", desc: "View biển cực đẹp", cost: "80K", image: tripSapa, address: "Bán đảo Sơn Trà, Đà Nẵng", rating: 4.6, tips: "Đi vào buổi chiều để ngắm hoàng hôn", bookingType: "cafe" },
      ],
    },
    {
      day: "Ngày 2", date: "",
      items: [
        { id: "dn5", time: "07:00", title: "Bình minh tại Bãi Mỹ Khê", desc: "Chạy bộ + check-in sống ảo", cost: "Miễn phí", image: tripDanang, address: "Bãi biển Mỹ Khê, Đà Nẵng", rating: 4.9, tips: "Bình minh khoảng 5h30-6h, nên đi sớm", bookingType: "attraction" },
        { id: "dn6", time: "09:00", title: "Đi phố cổ Hội An", desc: "Dạo phố, mua quà lưu niệm", cost: "200K", image: tripHoian, address: "Phố cổ Hội An, Quảng Nam", rating: 4.8, tips: "Mua vé tham quan 120K, có thể vào 5 điểm", bookingUrl: "https://www.traveloka.com/vi-vn/activities/vietnam/product/hoi-an-ancient-town-2001012", bookingType: "attraction" },
        { id: "dn7", time: "12:00", title: "Ăn Cao lầu & Mì Quảng", desc: "Quán bà Liên - Phố cổ", cost: "120K", image: tripHoian, address: "22 Nguyễn Huệ, Hội An", rating: 4.7, tips: "Cao lầu chỉ có ở Hội An, nhất định phải thử", bookingType: "restaurant" },
        { id: "dn8", time: "19:00", title: "Thả đèn hoa đăng", desc: "Trải nghiệm văn hóa Hội An", cost: "50K", image: tripHoian, address: "Sông Thu Bồn, Hội An", rating: 4.9, tips: "Mua đèn từ người dân địa phương, hỗ trợ kinh tế cộng đồng", bookingType: "attraction" },
      ],
    },
    {
      day: "Ngày 3", date: "",
      items: [
        { id: "dn9", time: "08:00", title: "Chùa Linh Ứng Sơn Trà", desc: "Tượng Phật Quan Âm cao nhất VN", cost: "Miễn phí", image: tripSapa, address: "Bán đảo Sơn Trà, Đà Nẵng", rating: 4.7, tips: "Mặc trang phục kín đáo khi vào chùa", bookingType: "attraction" },
        { id: "dn10", time: "11:00", title: "Bảo tàng Chăm", desc: "Tìm hiểu văn hóa Chăm Pa", cost: "60K", image: tripDanang, address: "02 2 Tháng 9, Đà Nẵng", rating: 4.4, tips: "Có hướng dẫn viên miễn phí vào 9h và 14h", bookingType: "attraction" },
        { id: "dn11", time: "14:00", title: "Mua sắm tại chợ Hàn", desc: "Đặc sản, quà lưu niệm", cost: "500K", image: tripHoian, address: "119 Trần Phú, Đà Nẵng", rating: 4.2, tips: "Nhớ trả giá, thường giảm được 30-50%", bookingType: "attraction" },
      ],
    },
  ],
  "đà lạt": [
    {
      day: "Ngày 1", date: "",
      items: [
        { id: "dl1", time: "08:00", title: "Checkin homestay Đà Lạt", desc: "Nghỉ ngơi, hít khí trời trong lành", cost: "600K", image: tripSapa, address: "Phường 4, Đà Lạt", rating: 4.5, tips: "Nên chọn homestay có view đồi thông", bookingUrl: "https://www.traveloka.com/vi-vn/hotel/vietnam/area/da-lat-10159", bookingType: "hotel" },
        { id: "dl2", time: "10:00", title: "Hồ Tuyền Lâm", desc: "Chèo thuyền SUP, ngắm cảnh", cost: "200K", image: tripPhuquoc, address: "Hồ Tuyền Lâm, Đà Lạt", rating: 4.7, tips: "Đi sáng sớm để nước yên và ít người", bookingType: "attraction" },
        { id: "dl3", time: "12:30", title: "Ăn trưa bánh mì xíu mại", desc: "Quán Lê Hồng Phong - Đặc sản", cost: "50K", image: tripHoian, address: "102 Lê Hồng Phong, Đà Lạt", rating: 4.6, tips: "Quán rất đông, nên đi trước 12h", bookingType: "restaurant" },
        { id: "dl4", time: "15:00", title: "Làng hoa Vạn Thành", desc: "Chụp ảnh vườn hoa đẹp", cost: "30K", image: tripSapa, address: "Làng hoa Vạn Thành, Đà Lạt", rating: 4.3, tips: "Mùa hoa đẹp nhất: tháng 10-12", bookingType: "attraction" },
      ],
    },
    {
      day: "Ngày 2", date: "",
      items: [
        { id: "dl5", time: "06:00", title: "Săn mây đồi Đa Phú", desc: "Ngắm bình minh trên mây", cost: "Miễn phí", image: tripSapa, address: "Đồi Đa Phú, Đà Lạt", rating: 4.9, tips: "Cần đi lúc 5h sáng, mang áo ấm", bookingType: "attraction" },
        { id: "dl6", time: "09:00", title: "Thung lũng Tình Yêu", desc: "Dạo bộ, check-in sống ảo", cost: "100K", image: tripPhuquoc, address: "Thung lũng Tình Yêu, Đà Lạt", rating: 4.4, tips: "Nên đi bộ vòng quanh hồ, view rất đẹp", bookingUrl: "https://www.klook.com/vi/activity/28529-valley-of-love-ticket-da-lat/", bookingType: "attraction" },
        { id: "dl7", time: "12:00", title: "Lẩu gà lá é", desc: "Đặc sản Đà Lạt cho nhóm", cost: "250K", image: tripHoian, address: "Nguyễn Văn Trỗi, Đà Lạt", rating: 4.7, tips: "Gà ta nấu lá é, ăn kèm rau rừng", bookingType: "restaurant" },
        { id: "dl8", time: "20:00", title: "Chợ đêm Đà Lạt", desc: "Ăn vặt & mua sắm", cost: "150K", image: tripDanang, address: "Chợ đêm Đà Lạt", rating: 4.5, tips: "Thử sữa đậu nành nóng, bánh tráng nướng", bookingType: "attraction" },
      ],
    },
    {
      day: "Ngày 3", date: "",
      items: [
        { id: "dl9", time: "08:00", title: "Thiền viện Trúc Lâm", desc: "Tĩnh tâm, ngắm cảnh", cost: "Miễn phí", image: tripSapa, address: "Thiền viện Trúc Lâm, Đà Lạt", rating: 4.8, tips: "Có cáp treo đi xuống, 70K/lượt", bookingType: "attraction" },
        { id: "dl10", time: "11:00", title: "Tiệm cà phê Túi Mơ To", desc: "Cà phê view toàn thành phố", cost: "80K", image: tripDanang, address: "Phường 10, Đà Lạt", rating: 4.6, tips: "Nên ngồi tầng 2 để có view tốt nhất", bookingType: "cafe" },
        { id: "dl11", time: "14:00", title: "Ga xe lửa Đà Lạt", desc: "Check-in ga cổ đẹp nhất VN", cost: "Miễn phí", image: tripHoian, address: "01 Quang Trung, Đà Lạt", rating: 4.5, tips: "Có tàu chạy tuyến Đà Lạt - Trại Mát, 150K/vé", bookingType: "attraction" },
      ],
    },
  ],
};

const defaultItinerary = destinations["đà nẵng"];

function formatDate(dateStr: string, dayOffset: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + dayOffset);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const budgetLabels = ["< 1M", "1-3M", "3-5M", "5-10M", "10M+"];
const budgetEstimates = ["~800K", "~2M", "~4M", "~7.5M", "~12M"];

function createGenericItinerary(dest: string): TripDay[] {
  return [
    {
      day: "Ngày 1", date: "",
      items: [
        { id: "g1", time: "08:00", title: `Check-in khách sạn ${dest}`, desc: "Nghỉ ngơi, chuẩn bị hành trình", cost: "600K", image: tripSapa, address: dest, rating: 4.5, tips: "Nên đặt phòng trước để có giá tốt", bookingUrl: `https://www.traveloka.com/vi-vn/hotel/vietnam/city/${encodeURIComponent(dest)}`, bookingType: "hotel" },
        { id: "g2", time: "10:30", title: `Khám phá trung tâm ${dest}`, desc: "Tham quan các điểm nổi bật", cost: "200K", image: tripDanang, address: `Trung tâm ${dest}`, rating: 4.6, tips: "Hỏi người địa phương để biết chỗ hay", bookingType: "attraction" },
        { id: "g3", time: "12:30", title: `Thưởng thức đặc sản ${dest}`, desc: "Ăn trưa món địa phương", cost: "150K", image: tripHoian, address: dest, rating: 4.4, tips: "Tìm quán đông người địa phương ăn", bookingType: "restaurant" },
        { id: "g4", time: "15:00", title: `Cafe view đẹp tại ${dest}`, desc: "Nghỉ ngơi, check-in sống ảo", cost: "80K", image: tripPhuquoc, address: dest, rating: 4.3, tips: "Xem review trên Google Maps trước", bookingType: "cafe" },
      ],
    },
    {
      day: "Ngày 2", date: "",
      items: [
        { id: "g5", time: "07:00", title: `Ngắm bình minh tại ${dest}`, desc: "Khám phá vẻ đẹp buổi sáng", cost: "Miễn phí", image: tripSapa, address: dest, rating: 4.8, tips: "Dậy sớm để có ảnh đẹp", bookingType: "attraction" },
        { id: "g6", time: "09:30", title: `Tham quan danh lam ${dest}`, desc: "Điểm du lịch nổi tiếng", cost: "150K", image: tripDanang, address: dest, rating: 4.7, tips: "Mang theo nước uống và kem chống nắng", bookingUrl: `https://www.klook.com/vi/search/?query=${encodeURIComponent(dest)}`, bookingType: "attraction" },
        { id: "g7", time: "12:00", title: `Ăn trưa đặc sản vùng miền`, desc: "Trải nghiệm ẩm thực", cost: "200K", image: tripHoian, address: dest, rating: 4.5, tips: "Thử các món đặc trưng vùng miền", bookingType: "restaurant" },
        { id: "g8", time: "19:00", title: `Khám phá ${dest} về đêm`, desc: "Chợ đêm, phố đi bộ", cost: "100K", image: tripPhuquoc, address: dest, rating: 4.6, tips: "Đi bộ để cảm nhận không khí", bookingType: "attraction" },
      ],
    },
    {
      day: "Ngày 3", date: "",
      items: [
        { id: "g9", time: "08:00", title: `Địa điểm tâm linh ${dest}`, desc: "Tham quan chùa, đền", cost: "Miễn phí", image: tripSapa, address: dest, rating: 4.7, tips: "Mặc trang phục kín đáo", bookingType: "attraction" },
        { id: "g10", time: "11:00", title: `Mua sắm quà lưu niệm`, desc: "Chợ địa phương, đặc sản", cost: "300K", image: tripHoian, address: dest, rating: 4.3, tips: "Nhớ trả giá khi mua ở chợ", bookingType: "attraction" },
        { id: "g11", time: "14:00", title: `Check-out và trả phòng`, desc: "Kết thúc chuyến đi", cost: "Miễn phí", image: tripDanang, address: dest, rating: 4.5, tips: "Kiểm tra đồ đạc trước khi rời đi", bookingType: "hotel" },
      ],
    },
  ];
}

export function generateTrip(destination: string, startDate: string, endDate: string, budget: number, styles: string[]): TripPlan {
  const key = destination.toLowerCase().trim();
  const matched = Object.keys(destinations).find(k => key.includes(k));
  
  const displayDest = destination || "Đà Nẵng";
  const baseItinerary = matched ? destinations[matched] : createGenericItinerary(displayDest);
  
  const days = baseItinerary.map((day, i) => ({
    ...day,
    date: startDate ? formatDate(startDate, i) : day.date,
  }));

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const numDays = start && end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 3;
  const numNights = numDays - 1;

  const dateRange = start && end
    ? `${formatDate(startDate, 0)} - ${formatDate(endDate, 0)}`
    : "15/03 - 17/03/2026";

  const title = `${displayDest} ${numDays}N${numNights}Đ`;

  const tagMap: Record<string, string> = { healing: "Chữa lành", food: "Ẩm thực", photo: "Sống ảo", adventure: "Mạo hiểm" };
  const tags = styles.map(s => tagMap[s] || s);

  const totalCost = budgetEstimates[budget] || "~3M";

  return {
    id: Date.now().toString(),
    destination: displayDest,
    title,
    days: days.slice(0, numDays),
    totalCost,
    rating: 4.8,
    duration: `${numDays} ngày ${numNights} đêm`,
    image: days[0]?.items[0]?.image || tripDanang,
    tags: tags.length ? tags : ["Du lịch"],
    dateRange,
  };
}

export function getSavedTrips(): TripPlan[] {
  try {
    return JSON.parse(localStorage.getItem("chiptrip_saved") || "[]");
  } catch { return []; }
}

export function saveTrip(trip: TripPlan) {
  const existing = getSavedTrips();
  if (!existing.find(t => t.id === trip.id)) {
    existing.push(trip);
    localStorage.setItem("chiptrip_saved", JSON.stringify(existing));
  }
}

export function deleteTrip(id: string) {
  const existing = getSavedTrips().filter(t => t.id !== id);
  localStorage.setItem("chiptrip_saved", JSON.stringify(existing));
}

export function renameTrip(id: string, newTitle: string) {
  const trips = getSavedTrips();
  const trip = trips.find(t => t.id === id);
  if (trip) {
    trip.title = newTitle;
    localStorage.setItem("chiptrip_saved", JSON.stringify(trips));
  }
}

// Credits system (mock)
export function getCredits(): number {
  try {
    return parseInt(localStorage.getItem("chiptrip_credits") || "5", 10);
  } catch { return 5; }
}

export function useCredit(): boolean {
  const credits = getCredits();
  if (credits <= 0) return false;
  localStorage.setItem("chiptrip_credits", String(credits - 1));
  return true;
}

export function addCredits(amount: number) {
  const credits = getCredits();
  localStorage.setItem("chiptrip_credits", String(credits + amount));
}

// Packing list generator
export function generatePackingList(destination: string, numDays: number, styles: string[]): PackingItem[] {
  const items: PackingItem[] = [
    // Documents
    { id: "p1", label: "CMND/CCCD/Hộ chiếu", category: "documents", checked: false },
    { id: "p2", label: "Vé máy bay / vé tàu", category: "documents", checked: false },
    { id: "p3", label: "Xác nhận đặt phòng", category: "documents", checked: false },
    // Clothing
    { id: "p4", label: `${numDays} bộ quần áo`, category: "clothing", checked: false },
    { id: "p5", label: "Đồ ngủ", category: "clothing", checked: false },
    { id: "p6", label: "Dép / giày thoải mái", category: "clothing", checked: false },
    { id: "p7", label: "Mũ / nón", category: "clothing", checked: false },
    // Toiletries
    { id: "p8", label: "Kem chống nắng SPF50+", category: "toiletries", checked: false },
    { id: "p9", label: "Bàn chải & kem đánh răng", category: "toiletries", checked: false },
    { id: "p10", label: "Khăn mặt", category: "toiletries", checked: false },
    // Electronics
    { id: "p11", label: "Sạc điện thoại", category: "electronics", checked: false },
    { id: "p12", label: "Pin dự phòng", category: "electronics", checked: false },
    // Medicine
    { id: "p13", label: "Thuốc đau bụng / tiêu chảy", category: "medicine", checked: false },
    { id: "p14", label: "Băng cá nhân", category: "medicine", checked: false },
  ];

  // Add style-specific items
  if (styles.includes("adventure")) {
    items.push(
      { id: "pa1", label: "Giày leo núi", category: "clothing", checked: false },
      { id: "pa2", label: "Áo khoác gió", category: "clothing", checked: false },
      { id: "pa3", label: "Thuốc chống say xe", category: "medicine", checked: false },
    );
  }
  if (styles.includes("photo")) {
    items.push(
      { id: "pp1", label: "Máy ảnh / Gimbal", category: "electronics", checked: false },
      { id: "pp2", label: "Tripod / Gậy selfie", category: "electronics", checked: false },
    );
  }
  if (styles.includes("healing")) {
    items.push(
      { id: "ph1", label: "Sách đọc", category: "misc", checked: false },
      { id: "ph2", label: "Tinh dầu thư giãn", category: "misc", checked: false },
    );
  }
  if (styles.includes("food")) {
    items.push(
      { id: "pf1", label: "Thuốc tiêu hoá", category: "medicine", checked: false },
    );
  }

  // Cold-weather destinations
  const coldPlaces = ["đà lạt", "sapa", "sa pa", "mộc châu", "hà giang"];
  if (coldPlaces.some(p => destination.toLowerCase().includes(p))) {
    items.push(
      { id: "pc1", label: "Áo khoác dày / áo ấm", category: "clothing", checked: false },
      { id: "pc2", label: "Khăn quàng cổ", category: "clothing", checked: false },
    );
  }

  // Beach destinations
  const beachPlaces = ["đà nẵng", "phú quốc", "nha trang", "quy nhơn", "vũng tàu", "phan thiết"];
  if (beachPlaces.some(p => destination.toLowerCase().includes(p))) {
    items.push(
      { id: "pb1", label: "Đồ bơi", category: "clothing", checked: false },
      { id: "pb2", label: "Kính bơi", category: "misc", checked: false },
      { id: "pb3", label: "Khăn tắm biển", category: "misc", checked: false },
    );
  }

  return items;
}
