import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import { Home, Account, Login, CartPage, Checkout, Payment,AddPaymentDetail,PaymentSuccess, RoomView, CourseList, CourseDetail, CourseChekout, Mybookings, RoomDetail, BookingDetails } from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<Payment />} />
        <Route path="addPaymentDetail" element={<AddPaymentDetail />} />
        <Route path="paymentSuccess" element={<PaymentSuccess />} />
        <Route path="rooms" element={<RoomView />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="course/:id" element={<CourseDetail />} />
        <Route path="mybookings" element={<Mybookings />} />
        <Route path="coursecheckout" element={<CourseChekout />} />
        <Route path="room/:id" element={<RoomDetail />} />
        <Route path="/account/bookings/:bookingId" element={<BookingDetails />} />

      </Route>
    </Route>
  )
);

export { router };
