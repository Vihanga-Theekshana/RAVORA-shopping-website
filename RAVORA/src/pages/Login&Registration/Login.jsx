import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  const isModal = Boolean(background);
  //create email , password , message usestaes
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const submithandel = async (e) => {
    e.preventDefault();
    try {
      const value = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", value.data.token);
      localStorage.setItem("role", value.data.user.role);
      localStorage.setItem("user_id", value.data.user.id);
      localStorage.setItem("username", value.data.user.username);
      localStorage.setItem("user_email", value.data.user.email);
      notifySuccess(value.data.message || "Logged in successfully");
      setemail(""); //erasedata
      setpassword("");
      // redirect based on user
      if (value.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 z-50 bg-black/50"
          : "min-h-screen bg-white px-4 py-12"
      }
      onClick={
        isModal ? () => navigate(background?.pathname || "/") : undefined
      }
    >
      <div
        className={`relative flex items-center justify-center ${isModal ? "min-h-screen p-4 sm:p-5" : "min-h-[70vh]"}`}
      >
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={submithandel} //call subit handel
          className="relative mx-2 w-full max-w-[400px] rounded-xl bg-white p-4 text-left text-sm text-gray-500 shadow-[0px_0px_10px_0px] shadow-black/10 sm:mx-4 sm:p-6"
        >
          {isModal && (
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
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
          )}
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
            <Link className="text-black underline" to="/forgot-password">
              Forgot Password
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mb-3 bg-gray-700 hover:bg-black active:scale-95 transition py-2.5 rounded-full text-white"
          >
            Log in
          </button>
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
