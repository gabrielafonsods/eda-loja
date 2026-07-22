import { Menu } from "react-admin";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export const AppMenu = () => (
  <Menu>
    <Menu.ResourceItems />
    <Menu.Item to="/reports" primaryText="Relatórios" leftIcon={<AssessmentIcon />} />
    <Menu.Item to="/stock" primaryText="Estoque" leftIcon={<Inventory2Icon />} />
  </Menu>
);
