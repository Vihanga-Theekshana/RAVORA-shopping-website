import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Footer from "./components/common/footer/Footer";
import Navbar from "./components/common/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import Menclothing from "./pages/Menclothingpage";
import Womenclothing from "./pages/Womenclothing";
import Login from "./pages/Login&Registration/Login";
import Signup from "./pages/Login&Registration/Signup";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Men" element={<Menclothing />} />
        <Route path="/Women" element={<Womenclothing />} />
      </Routes>
      {/* <Homepage /> */}
      {/* <Menclothing /> */}
      {/* <Login /> */}
      {/* <Signup />
       */}
      <Footer />
    </>
  );
}

export default App;
