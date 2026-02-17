import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Example() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");

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
      setmessage(response.data.message);

      setusername("");
      setemail("");
      setpassword("");
    } catch (err) {
      setmessage(err.response?.data?.message || "Error register user");
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={() => navigate(background?.pathname || "/")}
    >
      <div className="flex  justify-center items-center p-5">
        <form
          onClick={(e) => e.stopPropagation()}
          className="bg-white text-gray-500 w-full mt-33 max-w-[400px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
          onSubmit={handelsubmit}
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
          <p>{message}</p>

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
