import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detailspage from "./pages/DetailsPage";
import CategoryPage from "./pages/CategoryPage";
import MyCartPage from "./pages/MyCartPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import BookingFinishedPage from "./pages/BookingFinishedPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyBookingDetailsPage from "./pages/MyBookingDetailsPage";
import BrowsePage from "./pages/BrowsePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePage/>} />
        <Route path="/cosmetic/:slug" element={<Detailspage/>} />
        <Route path="/category/:slug" element={<CategoryPage/>} />
        <Route path="/cart" element={<MyCartPage/>} />
        <Route path="/booking" element={<BookingPage/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/booking-finished" element={<BookingFinishedPage/>} />
        <Route path="/check-booking" element={<MyOrdersPage/>} />
        <Route path="/my-booking" element={<MyBookingDetailsPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
