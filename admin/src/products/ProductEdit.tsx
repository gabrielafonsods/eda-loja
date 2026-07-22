import { Edit } from "react-admin";
import { ProductForm } from "./ProductForm";
import { BackToListActions } from "../BackToListActions";

export const ProductEdit = () => (
  <Edit actions={<BackToListActions />}>
    <ProductForm />
  </Edit>
);
