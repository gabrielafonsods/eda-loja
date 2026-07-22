import { Edit } from "react-admin";
import { CategoryForm } from "./CategoryForm";
import { BackToListActions } from "../BackToListActions";

export const CategoryEdit = () => (
  <Edit actions={<BackToListActions />}>
    <CategoryForm />
  </Edit>
);
