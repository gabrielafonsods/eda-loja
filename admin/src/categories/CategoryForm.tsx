import { SimpleForm, TextInput, required } from "react-admin";

export const CategoryForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nome da categoria" validate={required()} fullWidth />
  </SimpleForm>
);
