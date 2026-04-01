import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      const value = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        { email, password },
      );
      setMessage(value.data.message);
      localStorage.removeItem("reset_email");
      navigate("/Login");
    } else {
      setMessage("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="relative flex min-h-[70vh] items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-2 w-full max-w-[420px] rounded-xl bg-white p-5 text-left text-sm text-gray-600 shadow-[0px_0px_10px_0px] shadow-black/10 sm:mx-4 sm:p-6"
        >
          <h2 className="mb-3 text-center text-2xl font-semibold text-gray-800">
            Reset Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Enter your new password below.
          </p>

          {message && (
            <p className="mb-4 text-center text-sm text-red-600">{message}</p>
          )}

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-400/30 px-4 py-2.5 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-4 w-full rounded-full border border-gray-400/30 px-4 py-2.5 outline-none"
            required
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gray-700 py-2.5 text-white transition hover:bg-black"
          >
            Reset Password
          </button>

          <p className="mt-4 text-center">
            <Link
              to="/verify-otp"
              className="font-semibold text-black underline"
            >
              Back
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
