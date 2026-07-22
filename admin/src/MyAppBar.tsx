import { AppBar, TitlePortal } from "react-admin";
import Box from "@mui/material/Box";

export const MyAppBar = () => (
  <AppBar>
    <Box display="flex" alignItems="center" gap={1.5} flex={1}>
      <img
        src="/logo.png"
        alt="Embalagens Dos Anjos"
        style={{ height: 32, width: 32, borderRadius: "50%" }}
      />
      <TitlePortal />
    </Box>
  </AppBar>
);
