export interface Prize {
  id: number;
  name: string;
  icon: string;
  qty: number;
  chance: number;
}

export interface User {
  id: number;
  code: string;
  name: string;
  phone: string;
}

export const PRIZES: Prize[] = [
  { id: 1, name: "Chỉ Vàng 20 Năm", icon: "✨", qty: 2, chance: 1 },
  { id: 2, name: "Vé Bay Khứ Hồi", icon: "✈️", qty: 5, chance: 5 },
  { id: 3, name: "Tai Nghe Chống Ồn", icon: "🎧", qty: 10, chance: 8 },
  { id: 4, name: "Gói Data VIP 1 Năm", icon: "📶", qty: 50, chance: 15 },
  { id: 5, name: "Sạc Dự Phòng Cao Cấp", icon: "🔋", qty: 30, chance: 10 },
  { id: 6, name: "Bình Giữ Nhiệt Lộc Phát", icon: "🥤", qty: 100, chance: 20 },
  { id: 7, name: "Voucher 1.000.000đ", icon: "🎟️", qty: 20, chance: 7 },
  { id: 8, name: "Túi Xách Công Sở", icon: "💼", qty: 15, chance: 5 },
  { id: 9, name: "Loa Bluetooth Mini", icon: "🔊", qty: 25, chance: 9 },
  { id: 10, name: "Sổ Tay Da 20 Năm", icon: "📓", qty: 100, chance: 10 },
  { id: 11, name: "Mũ Bảo Hiểm Cao Cấp", icon: "🪖", qty: 40, chance: 8 },
  { id: 12, name: "Voucher 500.000đ", icon: "🎫", qty: 50, chance: 2 },
];

const familyNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Đặng", "Bùi"];
const middleNames = ["Văn", "Thị", "Minh", "Anh", "Đức", "Hồng", "Gia", "Quốc", "Thanh", "Ngọc"];
const firstNames = ["Sơn", "Hương", "Tuấn", "Lan", "Hùng", "Trang", "Dũng", "Phương", "Khoa", "Linh", "Bảo", "Mai", "Thắng", "Uyên", "Đạt", "Hạnh", "Quân", "Nga", "Trí", "Yến"];

export const USERS: User[] = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  code: `KH${(i + 1).toString().padStart(3, '0')}`,
  name: `${familyNames[i % familyNames.length]} ${middleNames[(i * 3 + 1) % middleNames.length]} ${firstNames[(i * 7 + 2) % firstNames.length]}`,
  phone: `09${(10000000 + ((i * 73 + 17) * 9301 + 49297) % 90000000).toString().slice(0, 8)}`,
}));
