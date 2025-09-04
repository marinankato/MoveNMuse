import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import { Home, Login, CartPage, Checkout, CourseList, CourseDetail, CourseChekout, Mybookings } from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />

        <Route path="courses" element={<CourseList />} />
        <Route path="course/:id" element={<CourseDetail />} />
        <Route path="mybookings" element={<Mybookings />} />
        <Route path="coursecheckout" element={<CourseChekout />} />
      </Route>
    </Route>
  )
);

export { router };
