import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Footer from "./components/common/footer/Footer";
import Navbar from "./components/common/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import Menclothing from "./pages/Menclothingpage";
import Womenclothing from "./pages/Womenclothing";
import Login from "./pages/Login&Registration/Login";
import Signup from "./pages/Login&Registration/Signup";
import Itemdetail from "./components/Items/Itemdetail";
import Whitebox from "./pages/Login&Registration/Whitebox";
import Admin from "./pages/Admindashboard/admin";
import Userdashboard from "./pages/Userdashboard/Userdashboard";
import Cart from "./pages/Cart";
function App() {
  const location = useLocation();
  const state = location.state;
  const background = state?.backgroundLocation;

  return (
    <>
      <Navbar />

      <Routes location={background || location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/Men" element={<Menclothing />} />
        <Route path="/Women" element={<Womenclothing />} />
        <Route path="*" element={<Whitebox />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<Userdashboard />} />
        <Route path="/itemdetail/:id" element={<Itemdetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {/* <Homepage /> */}

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
