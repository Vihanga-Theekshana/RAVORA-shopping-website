import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notify";

export default function Example() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const handelsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          email,
          password,
        },
      );
      notifySuccess(response.data.message || "Account created successfully");

      setusername("");
      setemail("");
      setpassword("");
    } catch (err) {
      notifyError(err.response?.data?.message || "Error register user");
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  const isModal = Boolean(background);
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
          className="mx-2 w-full max-w-[400px] rounded-lg bg-white px-4 py-8 text-left text-sm text-gray-500 shadow-[0px_0px_10px_0px] shadow-black/10 sm:mx-4 sm:p-6 sm:py-8"
          onSubmit={handelsubmit}
        >
          {isModal && (
            <button
              type="button"
              className="absolute right-4 top-4 sm:right-6 sm:top-6"
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign Up
          </h2>

          <input
            id="username"
            className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          />
          <input
            id="email"
            className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <input
            id="password"
            className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

          <button className="w-full mb-3 bg-gray-700 hover:bg-black transition-all active:scale-95 py-2.5 rounded text-white font-medium">
            Create Account
          </button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/Login"
              state={{ backgroundLocation: background || location }}
            >
              <button className="text-black font-semibold underline">
                Log In
              </button>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
