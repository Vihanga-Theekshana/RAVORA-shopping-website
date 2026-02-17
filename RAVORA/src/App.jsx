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
function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Navbar />

      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/Men" element={<Menclothing />} />
        <Route path="/Women" element={<Womenclothing />} />
      </Routes>
      {/* <Homepage /> */}
      {/* <Menclothing /> */}

      {/* <Itemdetail /> */}
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
