import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  SearchInput,
  EditButton,
  ImageField,
  FunctionField,
} from "react-admin";

const productFilters = [
  <SearchInput source="q" alwaysOn key="q" placeholder="Buscar produto..." />,
];

export const ProductList = () => (
  <List filters={productFilters} title="Produtos">
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
      <ImageField source="imageUrl" label="Foto" />
      <TextField source="name" label="Nome" />
      <FunctionField
        label="Categoria"
        render={(record: any) => record.category?.name || "—"}
      />
      <TextField source="supplier" label="Fornecedor" />
      <BooleanField source="active" label="Ativo" />
      <EditButton label="Editar" />
    </Datagrid>
  </List>
);
