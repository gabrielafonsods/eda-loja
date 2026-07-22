import { defaultTheme, RaThemeOptions } from "react-admin";

export const edaTheme: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    primary: {
      main: "#9c6b41", // terracota (cor principal da marca)
    },
    secondary: {
      main: "#7a5230", // terracota escuro
    },
    background: {
      default: "#fbf2e7", // pêssego claro (fundo)
      paper: "#ffffff",
    },
  },
  typography: {
    ...defaultTheme.typography,
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    ...defaultTheme.components,
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: "#9c6b41",
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          "&.RaMenuItemLink-active": {
            borderLeft: "3px solid #9c6b41",
            backgroundColor: "#f5dcc0",
          },
        },
      },
    },
  },
};
