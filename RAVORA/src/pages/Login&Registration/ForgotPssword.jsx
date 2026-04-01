import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const value = await axios.post("http://localhost:8080/api/auth/send-otp", {
        email,
      });
      notifySuccess(value.data.message || "OTP sent successfully");
      localStorage.setItem("reset_email", email);
      navigate("/verify-otp");
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="relative flex min-h-[70vh] items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-2 w-full max-w-[400px] rounded-xl bg-white p-5 text-left text-sm text-gray-600 shadow-[0px_0px_10px_0px] shadow-black/10 sm:mx-4 sm:p-6"
        >
          <h2 className="mb-3 text-center text-2xl font-semibold text-gray-800">
            Forgot Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Enter your email to verify your account.
          </p>

          <input
            id="forgot-email"
            className="w-full rounded-full border border-gray-400/30 px-4 py-2.5 outline-none"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gray-700 py-2.5 text-white transition hover:bg-black"
          >
            Verify
          </button>

          <p className="mt-4 text-center">
            <Link to="/Login" className="font-semibold text-black underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
