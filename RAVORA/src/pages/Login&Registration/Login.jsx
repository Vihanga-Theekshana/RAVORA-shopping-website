import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={() => navigate(-1)}
    >
      <div className="flex justify-center items-center p-5 relative">
        <form
          onClick={(e) => e.stopPropagation()}
          className="bg-white text-gray-500 max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
        >
          <button
            type="button"
            className="absolute"
            onClick={() => navigate(-1)}
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
            required
          />
          <input
            id="password"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
            type="password"
            placeholder="Enter your password"
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
          <p className="text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/Signup">
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
