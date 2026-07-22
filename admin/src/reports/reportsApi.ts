const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "eda_admin_token";

async function get(path: string) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export type SalesReport = {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  totalCost: number;
  netRevenue: number;
};

export type MonthlyBreakdown = {
  year: number;
  months: {
    month: number;
    totalOrders: number;
    totalRevenue: number;
    totalCost: number;
    netRevenue: number;
  }[];
};

export function getSalesReport(period: "day" | "week" | "month" | "year") {
  return get(`/reports/sales?period=${period}`) as Promise<SalesReport>;
}

export function getMonthlyBreakdown(year: number) {
  return get(`/reports/sales/monthly?year=${year}`) as Promise<MonthlyBreakdown>;
}
