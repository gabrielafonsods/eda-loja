import { TopToolbar, ListButton } from "react-admin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackToListActions = () => (
  <TopToolbar>
    <ListButton label="Voltar" icon={<ArrowBackIcon />} />
  </TopToolbar>
);
