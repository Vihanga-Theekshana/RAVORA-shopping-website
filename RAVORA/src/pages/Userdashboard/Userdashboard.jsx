import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(Number(value || 0))}`;

const getOrderItemImage = (image) =>
  image ? `http://localhost:8080/upload/${image}` : "";

const Userdashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    username: localStorage.getItem("username") || "Customer",
    email: localStorage.getItem("user_email") || "",
    phone: "-",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const [ordersRes, meRes] = await Promise.all([
          axios.get("http://localhost:8080/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedOrders = ordersRes.data.orders || [];
        setOrders(fetchedOrders);

        const latestPhone =
          fetchedOrders.find((order) => order.phone)?.phone || "-";
        setProfile({
          username: localStorage.getItem("username") || "Customer",
          email:
            localStorage.getItem("user_email") ||
            meRes.data.user?.email ||
            "",
          phone: latestPhone,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handellogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      localStorage.removeItem("user_email");
      navigate("/");
    } catch (err) {
      console.error(err + "Logout failed");
    }
  };

  return (
    <section className="px-4 py-6 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[2rem] font-bold tracking-tight sm:text-3xl">
            My Dashboard
          </h1>

          <button
            className="rounded-full border border-black px-4 py-2 text-sm transition hover:bg-black hover:text-white cursor-pointer"
            onClick={handellogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-7 max-w-lg">
          <div className="rounded-3xl border border-black p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>

            <div className="mt-5 space-y-2.5 text-base">
              <p>
                <span className="font-semibold">Name:</span> {profile.username}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {profile.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Order History</h2>

          <div className="mt-5 rounded-3xl border border-black p-4 sm:p-5">
            {loading ? (
              <p className="text-sm text-gray-600">Loading orders...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl bg-gray-50 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-8.954 5.168a.75.75 0 0 1-.75 0L1.5 7.5m18.75 0-8.954-5.168a.75.75 0 0 0-.75 0L1.5 7.5m18.75 0v9A2.25 2.25 0 0 1 18 18.75H3A2.25 2.25 0 0 1 .75 16.5v-9"
                  />
                </svg>
                <p className="text-base">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">
                          Order #{order.order_id}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                          {order.address}, {order.city}, {order.postal_code}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                          {order.payment_method}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {order.payment_status}
                      </span>
                      <span className="rounded-full bg-black px-3 py-1 text-white">
                        {order.order_status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {order.items?.map((item, index) => (
                        <div
                          key={`${order.order_id}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-3 py-3 text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                              style={{
                                backgroundImage: item.image
                                  ? `url(${getOrderItemImage(item.image)})`
                                  : "linear-gradient(#e5e7eb, #d1d5db)",
                              }}
                            ></div>
                            <div>
                              <p className="font-medium text-sm">{item.product_name}</p>
                              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                                Qty: {item.quantity}
                                {item.size ? ` | Size: ${item.size}` : ""}
                                {item.color ? ` | Color: ${item.color}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(item.product_price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Userdashboard;
