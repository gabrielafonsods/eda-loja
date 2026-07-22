import { List, Datagrid, TextField, EditButton } from "react-admin";

export const CategoryList = () => (
  <List title="Categorias">
    <Datagrid
      rowClick="edit"
      sx={{
        "& .RaDatagrid-headerCell": {
          backgroundColor: "#f5dcc0",
          fontWeight: 600,
        },
        "& .RaDatagrid-row:hover": {
          backgroundColor: "#fbf2e7",
        },
      }}
    >
      <TextField source="name" label="Nome" />
      <EditButton label="Editar" />
    </Datagrid>
  </List>
);
