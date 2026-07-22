import { Create } from "react-admin";
import { ProductForm } from "./ProductForm";
import { BackToListActions } from "../BackToListActions";

export const ProductCreate = () => (
  <Create actions={<BackToListActions />}>
    <ProductForm />
  </Create>
);
