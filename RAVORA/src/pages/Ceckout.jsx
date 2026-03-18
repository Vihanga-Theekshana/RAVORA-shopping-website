import { useState } from "react";
import { useNavigate } from "react-router-dom";

const paymentMethods = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="1.8" />
        <path d="M7 12h.01M17 12h.01" />
      </svg>
    ),
  },
  {
    id: "card",
    title: "Card Payment",
    description: "Pay securely with your card",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
];

const orderItems = [
  {
    name: "Classic White Shirt",
    quantity: 1,
    price: 2499,
  },
];

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(value)}`;

const Ceckout = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    fullName: "piyal",
    email: "piyal@gmail.com",
    phoneNumber: "212232",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = 300;
  const total = subtotal + deliveryFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="bg-white px-4 py-6 text-black sm:px-5 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
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
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium sm:text-base"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-11 w-full border border-black px-4 text-sm outline-none transition focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium sm:text-base"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 w-full border border-black px-4 text-sm outline-none transition focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-medium sm:text-base"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="h-11 w-full border border-black px-4 text-sm outline-none transition focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium sm:text-base"
                  >
                    Delivery Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    className="w-full resize-none border border-black px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium sm:text-base"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Colombo"
                      className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-sm font-medium sm:text-base"
                    >
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10100"
                      className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold sm:text-[1.35rem]">
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPayment === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 transition ${
                        isSelected
                          ? "border-black bg-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedPayment(method.id)}
                        className="h-5 w-5 accent-blue-600"
                      />
                      <div className="text-neutral-900">{method.icon}</div>
                      <div>
                        <p className="text-base font-semibold">
                          {method.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {method.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedPayment === "card" && (
                <div className="mt-5 border border-black p-4 sm:p-5">
                  <div className="grid gap-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="mb-2 block text-sm font-medium sm:text-base"
                      >
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cardholderName"
                        className="mb-2 block text-sm font-medium sm:text-base"
                      >
                        Cardholder Name
                      </label>
                      <input
                        id="cardholderName"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="mb-2 block text-sm font-medium sm:text-base"
                        >
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvv"
                          className="mb-2 block text-sm font-medium sm:text-base"
                        >
                          CVV
                        </label>
                        <input
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className="h-11 w-full border border-black px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-neutral-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-bold sm:text-[1.35rem]">
              Order Summary
            </h2>
            <div className="border border-black p-4 sm:p-5">
              <div className="space-y-3.5">
                {orderItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-4 text-sm sm:text-base"
                  >
                    <p>
                      {item.name} x {item.quantity}
                    </p>
                    <p className="shrink-0">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>

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

              <button className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:text-base">
                Place Order - {formatCurrency(total)}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Ceckout;
