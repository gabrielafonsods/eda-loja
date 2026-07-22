import { Show, SimpleShowLayout, FunctionField, DateField } from "react-admin";
import { ConfirmOrderButton, CancelOrderButton, DeleteOrderButton } from "./OrderActions";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField
        label="Pedido"
        render={(record: any) =>
          `#${String(record.orderNumber).padStart(8, "0")}`
        }
      />
      <FunctionField
        label="Status"
        render={(record: any) => statusLabels[record.status] || record.status}
      />
      <DateField
        source="createdAt"
        label="Criado em"
        showTime
        locales="pt-BR"
        options={{ timeZone: "America/Sao_Paulo" }}
      />
      <DateField
        source="confirmedAt"
        label="Confirmado em"
        showTime
        locales="pt-BR"
        options={{ timeZone: "America/Sao_Paulo" }}
      />

      <FunctionField
        label="Itens do pedido"
        render={(record: any) => (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 4 }}>Produto</th>
                <th style={{ textAlign: "left", padding: 4 }}>Forma</th>
                <th style={{ textAlign: "right", padding: 4 }}>Qtd</th>
                <th style={{ textAlign: "right", padding: 4 }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(record.items || []).map((item: any) => (
                <tr key={item.id}>
                  <td style={{ padding: 4 }}>
                    {item.productName}
                    {item.variantDescription ? ` (${item.variantDescription})` : ""}
                  </td>
                  <td style={{ padding: 4 }}>
                    {item.saleType === "fardo" ? "Fardo" : "Unidade"}
                  </td>
                  <td style={{ textAlign: "right", padding: 4 }}>{item.quantity}</td>
                  <td style={{ textAlign: "right", padding: 4 }}>
                    R$ {Number(item.subtotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />

      <FunctionField
        label="Total"
        render={(record: any) => `R$ ${Number(record.totalAmount).toFixed(2)}`}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <ConfirmOrderButton />
        <CancelOrderButton />
        <DeleteOrderButton />
      </div>
    </SimpleShowLayout>
  </Show>
);
