import { useEffect, useState } from "react";
import { Title } from "react-admin";
import {
  getSalesReport,
  getMonthlyBreakdown,
  SalesReport,
  MonthlyBreakdown,
} from "./reportsApi";

const periods: { key: "day" | "week" | "month" | "year"; label: string }[] = [
  { key: "day", label: "Hoje" },
  { key: "week", label: "Últimos 7 dias" },
  { key: "month", label: "Este mês" },
  { key: "year", label: "Este ano" },
];

const monthNames = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatMoney(value: number) {
  return `R$ ${value.toFixed(2)}`;
}

function ReportCard({ report }: { report: SalesReport | null }) {
  const label = periods.find((p) => p.key === report?.period)?.label || "";
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        minWidth: 200,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{label}</div>
      {!report ? (
        <div>Carregando...</div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#666" }}>Bruto</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {formatMoney(report.totalRevenue)}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 8 }}>Custo</div>
          <div style={{ fontSize: 16 }}>{formatMoney(report.totalCost)}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 8 }}>Líquido</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#2e7d32" }}>
            {formatMoney(report.netRevenue)}
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
            {report.totalOrders} pedido(s) confirmado(s)
          </div>
        </>
      )}
    </div>
  );
}

function downloadCsv(breakdown: MonthlyBreakdown) {
  const header = "Mes,Pedidos,Bruto,Custo,Liquido\n";
  const rows = breakdown.months
    .map(
      (m) =>
        `${monthNames[m.month - 1]},${m.totalOrders},${m.totalRevenue.toFixed(2)},${m.totalCost.toFixed(2)},${m.netRevenue.toFixed(2)}`,
    )
    .join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio-${breakdown.year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<Record<string, SalesReport>>({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [breakdown, setBreakdown] = useState<MonthlyBreakdown | null>(null);

  useEffect(() => {
    periods.forEach(({ key }) => {
      getSalesReport(key).then((data) =>
        setReports((prev) => ({ ...prev, [key]: data })),
      );
    });
  }, []);

  useEffect(() => {
    setBreakdown(null);
    getMonthlyBreakdown(year).then(setBreakdown);
  }, [year]);

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div style={{ padding: 16 }}>
      <Title title="Relatórios" />

      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {periods.map(({ key }) => (
          <ReportCard key={key} report={reports[key] || null} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Detalhamento mensal</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            disabled={!breakdown}
            onClick={() => breakdown && downloadCsv(breakdown)}
          >
            Baixar CSV
          </button>
        </div>
      </div>

      {!breakdown ? (
        <div>Carregando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Mês</th>
              <th style={{ textAlign: "right", padding: 8 }}>Pedidos</th>
              <th style={{ textAlign: "right", padding: 8 }}>Bruto</th>
              <th style={{ textAlign: "right", padding: 8 }}>Custo</th>
              <th style={{ textAlign: "right", padding: 8 }}>Líquido</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.months.map((m) => (
              <tr key={m.month} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{monthNames[m.month - 1]}</td>
                <td style={{ textAlign: "right", padding: 8 }}>{m.totalOrders}</td>
                <td style={{ textAlign: "right", padding: 8 }}>
                  {formatMoney(m.totalRevenue)}
                </td>
                <td style={{ textAlign: "right", padding: 8 }}>
                  {formatMoney(m.totalCost)}
                </td>
                <td style={{ textAlign: "right", padding: 8, fontWeight: 600 }}>
                  {formatMoney(m.netRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 16, fontSize: 13, color: "#888" }}>
        "Líquido" aqui é bruto menos custo dos produtos vendidos — não inclui
        impostos. Produtos sem custo cadastrado contam como custo zero, o que
        deixa o líquido desses itens superestimado.
      </p>
    </div>
  );
};
