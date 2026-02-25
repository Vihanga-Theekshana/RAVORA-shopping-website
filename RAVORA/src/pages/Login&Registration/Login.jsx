import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  //create email , password , message usestaes
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");

  const submithandel = async (e) => {
    e.preventDefault();
    try {
      const value = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", value.data.token);
      localStorage.setItem("role", value.data.user.role);
      setmessage(value.data.message);
      setemail(""); //erasedata
      setpassword("");
      // redirect based on user
      if (value.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setmessage(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={() => navigate(background?.pathname || "/")}
    >
      <div className="flex justify-center items-center p-5 relative">
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={submithandel} //call subit handel
          className="bg-white mt-33 text-gray-500 max-w-[400px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
        >
          <button
            type="button"
            className="absolute"
            onClick={() => navigate(background?.pathname || "/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Login Now
          </h2>
          <input
            id="email"
            className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <input
            id="password"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
          <div className="text-right py-4">
            <a className="text-black underline" href="#">
              Forgot Password
            </a>
          </div>
          <button
            type="submit"
            className="w-full mb-3 bg-gray-700 hover:bg-black active:scale-95 transition py-2.5 rounded-full text-white"
          >
            Log in
          </button>
          {message}
          <p className="text-center mt-4">
            Don’t have an account?{" "}
            <Link
              to="/Signup"
              state={{ backgroundLocation: background || location }}
            >
              <button className="text-black font-semibold underline cursor-pointer">
                Signup Now
              </button>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
