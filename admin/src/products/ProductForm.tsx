import {
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  ImageField,
  required,
} from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const SectionTitle = ({ children }: { children: string }) => (
  <Typography
    variant="subtitle1"
    sx={{ fontWeight: 600, color: "primary.main", mt: 2, mb: 1 }}
  >
    {children}
  </Typography>
);

export const ProductForm = () => (
  <SimpleForm>
    <SectionTitle>Informações do produto</SectionTitle>

    <TextInput source="name" label="Nome do produto" validate={required()} fullWidth />
    <TextInput source="description" label="Descrição" multiline fullWidth />

    <Box display="flex" gap={2} flexWrap="wrap" width="100%">
      <ReferenceInput source="categoryId" reference="categories">
        <SelectInput optionText="name" label="Categoria" />
      </ReferenceInput>
      <TextInput source="supplier" label="Fornecedor" />
    </Box>

    <TextInput
      source="imageUrl"
      label="URL da foto do produto"
      fullWidth
      helperText="Cole o link de uma imagem já hospedada em algum lugar"
    />
    <ImageField source="imageUrl" title="name" label="Prévia" />

    <BooleanInput source="active" label="Produto ativo (aparece no site)" defaultValue={true} />

    <Divider sx={{ width: "100%", my: 3 }} />

    <SectionTitle>Opções de venda</SectionTitle>
    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
      Cada opção representa uma forma de vender esse produto — por exemplo, uma
      cor diferente, ou o mesmo item vendido por unidade e por fardo.
    </Typography>

    <ArrayInput source="variants" label={false}>
      <SimpleFormIterator>
        <Box display="flex" gap={2} flexWrap="wrap" width="100%">
          <TextInput source="attrCor" label="Cor" helperText={false} />
          <TextInput source="attrNumero" label="Número" helperText={false} />
          <TextInput source="attrSabor" label="Sabor" helperText={false} />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap" width="100%">
          <NumberInput
            source="stockQuantity"
            label="Estoque (unidades)"
            validate={required()}
            helperText={false}
          />
          <NumberInput source="minStock" label="Estoque mínimo" helperText={false} />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap" width="100%">
          <NumberInput
            source="unitPrice"
            label="Preço por unidade (R$)"
            validate={required()}
            helperText={false}
          />
          <NumberInput
            source="costPrice"
            label="Custo por unidade (R$)"
            helperText="Quanto você paga por unidade"
          />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap" width="100%">
          <NumberInput source="fardoSize" label="Unidades por fardo" helperText={false} />
          <NumberInput source="fardoPrice" label="Preço por fardo (R$)" helperText={false} />
        </Box>
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);
