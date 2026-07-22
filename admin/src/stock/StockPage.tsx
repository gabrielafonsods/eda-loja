import { useEffect, useState } from "react";
import { Title } from "react-admin";
import {
  fetchLowStock,
  fetchMovements,
  fetchProductsForPicker,
  restock,
  variantLabel,
  LowStockVariant,
  StockMovement,
  ProductForPicker,
} from "./stockApi";

const reasonLabels: Record<string, string> = {
  sale: "Venda",
  restock: "Reposição",
  adjustment: "Ajuste",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

// Mini-formulário de reposição, usado tanto nas linhas de estoque baixo
// quanto no bloco de entrada manual.
function RestockInlineForm({
  variantId,
  onDone,
}: {
  variantId: string;
  onDone: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError("Informe uma quantidade válida");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await restock(variantId, qty, note || undefined);
      setQuantity("");
      setNote("");
      onDone();
    } catch (err: any) {
      setError(err.message || "Erro ao registrar entrada");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <input
        type="number"
        min={1}
        placeholder="Qtd (unidades)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ width: 130, padding: 6 }}
      />
      <input
        type="text"
        placeholder="Nota (opcional, ex: fornecedor)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: 220, padding: 6 }}
      />
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Registrando..." : "Repor"}
      </button>
      {error && <span style={{ color: "#c62828", fontSize: 13 }}>{error}</span>}
    </div>
  );
}

function LowStockSection({
  items,
  loading,
  onRestocked,
}: {
  items: LowStockVariant[];
  loading: boolean;
  onRestocked: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ margin: "0 0 12px" }}>⚠️ Estoque baixo</h3>
      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div style={{ color: "#666" }}>Nenhum produto precisa de reposição agora.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Produto</th>
              <th style={{ textAlign: "right", padding: 8 }}>Estoque atual</th>
              <th style={{ textAlign: "right", padding: 8 }}>Mínimo</th>
              <th style={{ padding: 8 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <>
                <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    {variantLabel(v.product?.name || "(sem nome)", v.attributes)}
                  </td>
                  <td style={{ textAlign: "right", padding: 8, color: "#c62828", fontWeight: 600 }}>
                    {v.stockQuantity}
                  </td>
                  <td style={{ textAlign: "right", padding: 8 }}>{v.minStock}</td>
                  <td style={{ textAlign: "right", padding: 8 }}>
                    <button onClick={() => setOpenId(openId === v.id ? null : v.id)}>
                      {openId === v.id ? "Cancelar" : "Repor estoque"}
                    </button>
                  </td>
                </tr>
                {openId === v.id && (
                  <tr key={`${v.id}-form`} style={{ borderBottom: "1px solid #eee" }}>
                    <td colSpan={4} style={{ padding: "8px 8px 16px" }}>
                      <RestockInlineForm
                        variantId={v.id}
                        onDone={() => {
                          setOpenId(null);
                          onRestocked();
                        }}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ManualRestockSection({ onRestocked }: { onRestocked: () => void }) {
  const [products, setProducts] = useState<ProductForPicker[]>([]);
  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    fetchProductsForPicker().then(setProducts);
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ margin: "0 0 12px" }}>➕ Registrar entrada manual</h3>
      <p style={{ marginTop: 0, marginBottom: 12, fontSize: 13, color: "#666" }}>
        Use quando chega mercadoria nova do fornecedor, mesmo que o produto
        ainda não esteja em falta.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <select
          value={selectedVariant}
          onChange={(e) => setSelectedVariant(e.target.value)}
          style={{ padding: 6, minWidth: 260 }}
        >
          <option value="">Selecione um produto...</option>
          {products.map((p) =>
            p.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {variantLabel(p.name, v.attributes)} — estoque: {v.stockQuantity}
              </option>
            )),
          )}
        </select>
      </div>
      {selectedVariant && (
        <div style={{ marginTop: 8 }}>
          <RestockInlineForm
            variantId={selectedVariant}
            onDone={() => {
              setSelectedVariant("");
              onRestocked();
            }}
          />
        </div>
      )}
    </div>
  );
}

function MovementsSection({
  movements,
  loading,
}: {
  movements: StockMovement[];
  loading: boolean;
}) {
  return (
    <div>
      <h3 style={{ margin: "0 0 12px" }}>📋 Histórico de movimentações</h3>
      {loading ? (
        <div>Carregando...</div>
      ) : movements.length === 0 ? (
        <div style={{ color: "#666" }}>Nenhuma movimentação registrada ainda.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Data</th>
              <th style={{ textAlign: "left", padding: 8 }}>Produto</th>
              <th style={{ textAlign: "left", padding: 8 }}>Tipo</th>
              <th style={{ textAlign: "left", padding: 8 }}>Motivo</th>
              <th style={{ textAlign: "right", padding: 8 }}>Qtd</th>
              <th style={{ textAlign: "left", padding: 8 }}>Nota</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{formatDate(m.createdAt)}</td>
                <td style={{ padding: 8 }}>
                  {variantLabel(m.productName, undefined)}
                  {m.variantDescription ? ` (${m.variantDescription})` : ""}
                </td>
                <td
                  style={{
                    padding: 8,
                    color: m.type === "in" ? "#2e7d32" : "#c62828",
                    fontWeight: 600,
                  }}
                >
                  {m.type === "in" ? "Entrada" : "Saída"}
                </td>
                <td style={{ padding: 8 }}>{reasonLabels[m.reason] || m.reason}</td>
                <td style={{ textAlign: "right", padding: 8 }}>{m.quantityUnits}</td>
                <td style={{ padding: 8, color: "#666" }}>{m.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const StockPage = () => {
  const [lowStock, setLowStock] = useState<LowStockVariant[]>([]);
  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(true);

  const reloadLowStock = () => {
    setLoadingLowStock(true);
    fetchLowStock()
      .then(setLowStock)
      .finally(() => setLoadingLowStock(false));
  };

  const reloadMovements = () => {
    setLoadingMovements(true);
    fetchMovements()
      .then(setMovements)
      .finally(() => setLoadingMovements(false));
  };

  const reloadAll = () => {
    reloadLowStock();
    reloadMovements();
  };

  useEffect(() => {
    reloadAll();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <Title title="Estoque" />

      <LowStockSection
        items={lowStock}
        loading={loadingLowStock}
        onRestocked={reloadAll}
      />

      <ManualRestockSection onRestocked={reloadAll} />

      <MovementsSection movements={movements} loading={loadingMovements} />
    </div>
  );
};
