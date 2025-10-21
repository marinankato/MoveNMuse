import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import {
  Home,
  Account,
  Login,
  CartPage,
  Checkout,
  Payment,
  AddPaymentDetail,
  PaymentSuccess,
  RoomView,
  RoomDetail,
  CourseList,
  CourseDetail,
  BookingDetails,
  SessionList, 
  SessionForm,
  StaffSessionsPage,
  StaffCoursesPage,
  CourseForm,
  StaffInstructorsPage,
  InstructorForm,
} from "../pages";

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
        <Route path="rooms/:id" element={<RoomDetail />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/sessions/new" element={<SessionForm />} />
        <Route path="/sessions/:id/edit" element={<SessionForm />} />
        <Route path="/admin/sessions" element={<StaffSessionsPage />} />
        <Route path="/admin/sessions/new" element={<SessionForm />} />
        <Route path="/admin/sessions/:id/edit" element={<SessionForm />} /> 
        <Route path="/admin/courses" element={<StaffCoursesPage />} />
        <Route path="/admin/courses/new" element={<CourseForm />} />
        <Route path="/admin/courses/:id/edit" element={<CourseForm />} />
        <Route path="/admin/instructors" element={<StaffInstructorsPage />} />
        <Route path="/admin/instructors/new" element={<InstructorForm />} />
        <Route path="/admin/instructors/:id/edit" element={<InstructorForm />} />



        <Route path="/account/bookings/:bookingId" element={<BookingDetails />} />
      </Route>
    </Route>
  )
);

export { router };
