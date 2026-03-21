import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(value)}`;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const subtotal =
    location.state?.subtotal ??
    Number(localStorage.getItem("checkoutSubtotal") || 0);
  const deliveryFee = 300;
  const total = subtotal + deliveryFee;

  const submitToPayHere = (paymentUrl, formData) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentUrl;

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePlaceOrder = async () => {
    try {
      setError("");
      setMessage("");

      if (
        !fullName.trim() ||
        !email.trim() ||
        !phoneNumber.trim() ||
        !address.trim() ||
        !city.trim() ||
        !postalCode.trim()
      ) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);

      if (paymentMethod === "cod") {
        const res = await axios.post("http://localhost:8080/api/orders/cod", {
          fullName,
          email,
          phone: phoneNumber,
          address,
          city,
          postalCode,
          amount: total,
        });

        setMessage(
          `COD order placed successfully. Order ID: ${res.data.orderId}`,
        );
        return;
      }

      const nameParts = fullName.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || "Customer";

      const response = await axios.post(
        "http://localhost:8080/api/payhere/create-payment",
        {
          first_name,
          last_name,
          email,
          phone: phoneNumber,
          address,
          city,
          postal_code: postalCode,
          items: "RAVORA Clothing Order",
          amount: total,
        },
      );

      submitToPayHere(response.data.paymentUrl, response.data.formData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white px-4 py-6 text-black sm:px-5 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-black"
        >
          Back
        </button>

        <h1 className="mb-5 text-2xl font-bold tracking-tight sm:mb-6 sm:text-3xl">
          Checkout
        </h1>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-5">
            <div>
              <h2 className="mb-4 text-xl font-bold sm:text-[1.35rem]">
                Delivery Information
              </h2>

              <div className="grid gap-3.5">
                <div>
                  <label className="mb-2 block text-sm font-medium sm:text-base">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 w-full border border-black px-4 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full border border-black px-4 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium sm:text-base">
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-11 w-full border border-black px-4 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium sm:text-base">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full resize-none border border-black px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium sm:text-base">
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11 w-full border border-black px-4 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium sm:text-base">
                      Postal Code
                    </label>
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="h-11 w-full border border-black px-4 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold sm:text-[1.35rem]">
                Payment Method
              </h2>

              <div className="space-y-3 border border-black p-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Card Payment (PayHere)</span>
                </label>

                {paymentMethod === "card" && (
                  <p className="text-sm text-slate-600">
                    You will be redirected to PayHere secure payment page.
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-bold sm:text-[1.35rem]">
              Order Summary
            </h2>

            <div className="border border-black p-4 sm:p-5">
              <div className="my-5 h-px bg-black" />

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              </div>

              <div className="my-5 h-px bg-black" />

              <div className="flex items-center justify-between gap-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              {message && (
                <p className="mt-4 text-sm text-green-600">{message}</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:text-base disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : paymentMethod === "cod"
                    ? `Place COD Order - ${formatCurrency(total)}`
                    : `Pay Now - ${formatCurrency(total)}`}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
