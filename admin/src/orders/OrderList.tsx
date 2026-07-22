import {
  List,
  Datagrid,
  DateField,
  FunctionField,
  SelectInput,
} from "react-admin";
import { ConfirmOrderButton, CancelOrderButton, DeleteOrderButton } from "./OrderActions";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  pending: "#b8860b",
  confirmed: "#2e7d32",
  cancelled: "#c62828",
};

const orderFilters = [
  <SelectInput
    key="status"
    source="status"
    alwaysOn
    label="Status"
    choices={[
      { id: "pending", name: "Pendente" },
      { id: "confirmed", name: "Confirmado" },
      { id: "cancelled", name: "Cancelado" },
    ]}
  />,
];

export const OrderList = () => (
  <List filters={orderFilters} sort={{ field: "createdAt", order: "DESC" }}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField
        label="Pedido"
        render={(record: any) =>
          `#${String(record.orderNumber).padStart(8, "0")}`
        }
      />
      <FunctionField
        label="Status"
        render={(record: any) => (
          <span style={{ color: statusColors[record.status], fontWeight: 600 }}>
            {statusLabels[record.status] || record.status}
          </span>
        )}
      />
      <FunctionField
        label="Itens"
        render={(record: any) =>
          (record.items || [])
            .map((i: any) => `${i.quantity}x ${i.productName}`)
            .join(", ")
        }
      />
      <FunctionField
        label="Total"
        render={(record: any) =>
          `R$ ${Number(record.totalAmount).toFixed(2)}`
        }
      />
      <DateField
        source="createdAt"
        label="Criado em"
        showTime
        locales="pt-BR"
        options={{ timeZone: "America/Sao_Paulo" }}
      />
      <ConfirmOrderButton />
      <CancelOrderButton />
      <DeleteOrderButton />
    </Datagrid>
  </List>
);
