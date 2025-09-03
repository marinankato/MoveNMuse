import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import { Home, Login, CartPage, Checkout } from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Route>
  )
);

export { router };
