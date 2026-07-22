import { edaTheme } from "./theme";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { ProductList, ProductEdit, ProductCreate } from "./products";
import { OrderList, OrderShow } from "./orders";
import { CategoryList, CategoryEdit, CategoryCreate } from "./categories";
import { ReportsPage } from "./reports/ReportsPage";
import { StockPage } from "./stock/StockPage";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider} theme={edaTheme}>
    <Resource
      name="products"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
      recordRepresentation="name"
      options={{ label: "Produtos" }}
    />
    <Resource
      name="categories"
      list={CategoryList}
      edit={CategoryEdit}
      create={CategoryCreate}
      recordRepresentation="name"
      options={{ label: "Categorias" }}
    />
    <Resource
      name="orders"
      list={OrderList}
      show={OrderShow}
      options={{ label: "Pedidos" }}
    />
    <CustomRoutes>
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/stock" element={<StockPage />} />
    </CustomRoutes>
  </Admin>
);
