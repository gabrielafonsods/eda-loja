import { Button, useNotify, useRecordContext, useRedirect } from "react-admin";
import { confirmOrder, cancelOrder, deleteOrder } from "./ordersApi";

export const ConfirmOrderButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();

  if (!record || record.status !== "pending") return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await confirmOrder(record.id);
      notify("Pedido confirmado — estoque atualizado", { type: "success" });
      redirect("list", "orders");
    } catch (err: any) {
      notify(`Erro ao confirmar: ${err.message}`, { type: "error" });
    }
  };

  return (
    <Button label="Confirmar" onClick={handleClick} sx={{ color: "green" }} />
  );
};

export const CancelOrderButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();

  if (!record || record.status !== "pending") return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que quer cancelar esse pedido?")) return;
    try {
      await cancelOrder(record.id);
      notify("Pedido cancelado", { type: "info" });
      redirect("list", "orders");
    } catch (err: any) {
      notify(`Erro ao cancelar: ${err.message}`, { type: "error" });
    }
  };

  return (
    <Button label="Cancelar" onClick={handleClick} sx={{ color: "red" }} />
  );
};

export const DeleteOrderButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();

  if (!record) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Tem certeza que quer apagar esse pedido? Essa ação não pode ser desfeita.",
      )
    )
      return;
    try {
      await deleteOrder(record.id);
      notify("Pedido apagado", { type: "info" });
      redirect("list", "orders");
    } catch (err: any) {
      notify(`Erro ao apagar: ${err.message}`, { type: "error" });
    }
  };

  return (
    <Button label="Apagar" onClick={handleClick} sx={{ color: "grey" }} />
  );
};
