import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notify";

const Veryfiotp = () => {
  const email = localStorage.getItem("reset_email");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 4) {
      return;
    }
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const value = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        { otp, email },
      );
      notifySuccess(value.data.message || "OTP verified");
      navigate("/reset-password");
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to verify OTP");
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
            Verify OTP
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Enter the 4-digit verification code sent to your email.
          </p>

          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            className="w-full rounded-full border border-gray-400/30 px-4 py-2.5 text-center text-lg tracking-[0.4em] text-black outline-none"
            required
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-gray-700 py-2.5 text-white transition hover:bg-black"
          >
            Verify OTP
          </button>

          <p className="mt-4 text-center">
            <Link
              to="/forgot-password"
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

export default Veryfiotp;
