import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate } from "react-admin";
import { AppMenu } from "./Menu";
import { MyAppBar } from "./MyAppBar";

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={AppMenu} appBar={MyAppBar}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
