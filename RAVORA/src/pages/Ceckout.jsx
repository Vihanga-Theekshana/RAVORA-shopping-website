import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(value)}`;

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images;
  }

  try {
    return JSON.parse(images || "[]");
  } catch {
    return [];
  }
};

const getStoredCheckoutItems = () => {
  try {
    return JSON.parse(localStorage.getItem("checkoutItems") || "[]");
  } catch {
    return [];
  }
};

const normalizeCheckoutItem = (value) => ({
  ...value,
  images: normalizeImages(value.images),
  quantity: Number(value.quantity ?? value.qty ?? 1),
});

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedSubtotal = Number(localStorage.getItem("checkoutSubtotal") || 0);
  const initialItems = (location.state?.item ?? getStoredCheckoutItems()).map(
    normalizeCheckoutItem,
  );

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
  const [checkoutItems, setCheckoutItems] = useState(initialItems);

  // Keep checkout items in local state so quantity changes immediately update totals and order payloads.
  const subtotal =
    checkoutItems.length > 0
      ? checkoutItems.reduce((sum, value) => {
          const itemPrice = Number(value.price ?? value.product_price ?? 0);
          const itemQuantity = Number(value.quantity ?? value.qty ?? 1);
          return sum + itemPrice * itemQuantity;
        }, 0)
      : location.state?.subtotal ?? storedSubtotal;
  const deliveryFee = 300;
  const total = subtotal + deliveryFee;
  // Normalize cart items into the payload shape expected by the backend order APIs.
  const orderItems = checkoutItems.map((item) => ({
    product_id: item.product_id ?? item.id ?? item._id,
    product_name: item.product_name ?? item.name,
    product_price: Number(item.product_price ?? item.price ?? 0),
    quantity: Number(item.quantity ?? item.qty ?? 1),
    image: item.images?.[0] ?? item.image ?? null,
    size: item.size ?? null,
    color: item.color ?? null,
  }));

  useEffect(() => {
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    localStorage.setItem("checkoutSubtotal", String(subtotal));
  }, [checkoutItems, subtotal]);

  const handleQuantityChange = (itemId, type) => {
    setCheckoutItems((prev) =>
      prev.map((value) => {
        const currentId = value.id ?? value._id ?? value.product_id;
        if (currentId !== itemId) {
          return value;
        }

        const nextQuantity =
          type === "add"
            ? Number(value.quantity ?? value.qty ?? 1) + 1
            : Math.max(1, Number(value.quantity ?? value.qty ?? 1) - 1);

        return {
          ...value,
          quantity: nextQuantity,
        };
      }),
    );
  };

  // Redirect to PayHere by posting the payment fields through a temporary form.
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
      const token = localStorage.getItem("token");

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

      // COD creates the order directly in our backend without leaving the site.
      if (paymentMethod === "cod") {
        if (!token) {
          setError("Please log in to place your order");
          return;
        }

        const res = await axios.post(
          "http://localhost:8080/api/orders/cod",
          {
            fullName,
            email,
            phone: phoneNumber,
            address,
            city,
            postalCode,
            subtotal,
            deliveryFee,
            amount: total,
            items: orderItems,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMessage(
          `COD order placed successfully. Order ID: ${res.data.orderId}`,
        );
        return;
      }

      const nameParts = fullName.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || "Customer";
      if (!token) {
        setError("Please log in to place your order");
        return;
      }
      // Card payments create a pending order first, then redirect the user to PayHere.
      const response = await axios.post(
        "http://localhost:8080/api/payhere/create-payment",

        {
          fullName,
          first_name,
          last_name,
          email,
          phone: phoneNumber,
          address,
          city,
          postal_code: postalCode,
          items: orderItems,
          subtotal,
          deliveryFee,
          amount: total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
              <div>
                {checkoutItems.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Your cart is empty. Add items before placing an order.
                  </p>
                ) : (
                  checkoutItems.map((value) => {
                    const itemId = value.id ?? value._id ?? value.product_id;
                    const quantity = value.quantity ?? value.qty ?? 1;
                    const itemPrice = Number(
                      value.price ?? value.product_price ?? 0,
                    );
                    const itemTotal = itemPrice * quantity;
                    const imageUrl =
                      value.images?.length > 0
                        ? `http://localhost:8080/upload/${value.images[0]}`
                        : "";

                    return (
                      <div
                        key={itemId}
                        className="mt-3 rounded-2xl border-2 border-gray-300 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center bg-no-repeat"
                            style={{
                              backgroundImage: imageUrl
                                ? `url(${imageUrl})`
                                : "linear-gradient(#e5e7eb, #d1d5db)",
                            }}
                          ></div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 line-clamp-2 text-base font-medium">
                              {value.name ?? value.product_name}
                            </div>
                            <div className="text-sm text-gray-700">
                              {formatCurrency(itemPrice)}
                            </div>
                            {value.size && (
                              <div className="mt-1 text-xs text-gray-500">
                                Size: {value.size}
                              </div>
                            )}
                            {value.color && (
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <span>Color:</span>
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-black/20"
                                  style={{ backgroundColor: value.color }}
                                ></span>
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center border border-black text-black transition hover:bg-gray-100"
                                onClick={() =>
                                  handleQuantityChange(itemId, "minus")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14"
                                  />
                                </svg>
                              </button>

                              <div className="flex min-w-6 justify-center text-xl font-normal text-black">
                                {quantity}
                              </div>

                              <button
                                type="button"
                                className="flex h-9 w-9 cursor-pointer items-center justify-center border border-black text-black transition hover:bg-gray-100"
                                onClick={() =>
                                  handleQuantityChange(itemId, "add")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2 text-right text-base font-medium">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              {message && (
                <p className="mt-4 text-sm text-green-600">{message}</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || checkoutItems.length === 0}
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
