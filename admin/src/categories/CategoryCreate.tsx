import { Create } from "react-admin";
import { CategoryForm } from "./CategoryForm";
import { BackToListActions } from "../BackToListActions";

export const CategoryCreate = () => (
  <Create actions={<BackToListActions />}>
    <CategoryForm />
  </Create>
);
