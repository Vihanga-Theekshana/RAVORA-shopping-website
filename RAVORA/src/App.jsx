import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/common/footer/Footer";
import Navbar from "./components/common/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import Menclothing from "./pages/Menclothingpage";
import Womenclothing from "./pages/Womenclothing";
import Login from "./pages/Login&Registration/Login";
import Signup from "./pages/Login&Registration/Signup";
import ForgotPassword from "./pages/Login&Registration/ForgotPssword";
import Veryfiotp from "./pages/Login&Registration/Veryfiotp";
import ResetPassword from "./pages/Login&Registration/ResetPassword";
import Itemdetail from "./components/Items/Itemdetail";
import Whitebox from "./pages/Login&Registration/Whitebox";
import Admin from "./pages/Admindashboard/admin";
import Userdashboard from "./pages/Userdashboard/Userdashboard";
import Cart from "./pages/Cart";
import Ceckout from "./pages/Ceckout";
import PaymentSuccess from "./pages/PaymentSuccess";

import ProtectedRoute from "./Route_protect/ProtectedRoute";
import AdminRoute from "./Route_protect/AdminRoute";
import UserRoute from "./Route_protect/UserRoute";

function App() {
  const location = useLocation();
  const state = location.state;
  const background = state?.backgroundLocation;

  return (
    <>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      <Routes location={background || location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/Men" element={<Menclothing />} />
        <Route path="/Women" element={<Womenclothing />} />
        <Route path="/itemdetail/:id" element={<Itemdetail />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<Veryfiotp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/user"
          element={
            <UserRoute>
              <Userdashboard />
            </UserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Ceckout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Whitebox />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      )}

      <Footer />
    </>
  );
}

export default App;
