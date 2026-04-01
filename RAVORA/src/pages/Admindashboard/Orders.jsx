import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(Number(value || 0))}`;

const getOrderItemImage = (image) =>
  image ? `http://localhost:8080/upload/${image}` : "";

const Orders = ({ mode = "active" }) => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const loadOrderDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setDetailLoading(true);
      const res = await axios.get(`http://localhost:8080/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrder) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      setActionLoading(true);
      await axios.post(
        `http://localhost:8080/api/admin/orders/${selectedOrder.id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedOrder((prev) =>
        prev ? { ...prev, order_status: "DELIVERED" } : prev,
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, order_status: "DELIVERED" }
            : order,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const activeOrders = orders.filter((order) => order.order_status !== "DELIVERED");
  const completedOrders = orders.filter(
    (order) => order.order_status === "DELIVERED",
  );
  const visibleOrders = mode === "completed" ? completedOrders : activeOrders;

  const statCards = useMemo(
    () => [
      {
        title: "Total Products",
        value: stats ? String(stats.totalProducts) : "0",
        subtext: `${stats ? stats.outOfStock : 0} out of stock`,
        subtextClass: "text-red-500",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m20.25 7.5-8.954 5.168a.75.75 0 0 1-.75 0L1.5 7.5m18.75 0-8.954-5.168a.75.75 0 0 0-.75 0L1.5 7.5m18.75 0v9A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5v-9"
            />
          </svg>
        ),
      },
      {
        title: "Total Orders",
        value: stats ? String(stats.totalOrders) : "0",
        subtext: `${stats ? stats.pendingOrders : 0} pending`,
        subtextClass: "text-amber-500",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.11 1.5 1.989v4.875c0 1.036-.84 1.875-1.875 1.875H4.125A1.875 1.875 0 0 1 2.25 15.375V10.5c0-.879.616-1.705 1.5-1.989m16.5 0A48.108 48.108 0 0 0 12 7.5a48.108 48.108 0 0 0-8.25 1.011m16.5 0V6.375c0-1.036-.84-1.875-1.875-1.875h-12.75A1.875 1.875 0 0 0 3.75 6.375v2.136m16.5 0v.369a2.25 2.25 0 0 1-.659 1.591l-1.5 1.5a2.25 2.25 0 0 1-1.591.659H7.5a2.25 2.25 0 0 1-1.591-.659l-1.5-1.5A2.25 2.25 0 0 1 3.75 8.88v-.369"
            />
          </svg>
        ),
      },
      {
        title: "Total Sales",
        value: stats ? formatCurrency(stats.totalSales) : "Rs. 0",
        subtext: "Paid orders only",
        subtextClass: "text-green-500",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 18 9-9 4.5 4.5L21.75 6M21.75 6H15.75M21.75 6V12"
            />
          </svg>
        ),
      },
      {
        title: "Registered Users",
        value: stats ? String(stats.registeredUsers) : "0",
        subtext: "Customer accounts",
        subtextClass: "text-slate-500",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 10.5v-.75A4.5 4.5 0 0 0 13.5 15h-3A4.5 4.5 0 0 0 6 19.5V21m12 0v-.75a4.5 4.5 0 0 0-3.375-4.35M6 21v-.75a4.5 4.5 0 0 1 3.375-4.35"
            />
          </svg>
        ),
      },
    ],
    [stats],
  );

  return (
    <section className="w-full px-4 py-4 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {selectedOrder ? (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="mb-3 text-sm text-slate-600 cursor-pointer"
                >
                  Back to Orders
                </button>
                <h1 className="text-[2rem] font-bold tracking-tight text-black sm:text-3xl">
                  Order Details
                </h1>
              </div>

              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={
                  actionLoading ||
                  selectedOrder.order_status === "DELIVERED" ||
                  selectedOrder.order_status === "CANCELLED"
                }
                className="rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-50 cursor-pointer"
              >
                {actionLoading
                  ? "Updating..."
                  : selectedOrder.order_status === "DELIVERED"
                    ? "Completed"
                    : selectedOrder.order_status === "CANCELLED"
                      ? "Cancelled"
                    : "Complete Order"}
              </button>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-2xl border border-black bg-white p-5">
                <h2 className="text-lg font-semibold text-black">
                  Customer Details
                </h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-black">Order ID:</span>{" "}
                    {selectedOrder.order_id}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Name:</span>{" "}
                    {selectedOrder.full_name}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Email:</span>{" "}
                    {selectedOrder.email}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Phone:</span>{" "}
                    {selectedOrder.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Address:</span>{" "}
                    {selectedOrder.address}, {selectedOrder.city},{" "}
                    {selectedOrder.postal_code}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Payment:</span>{" "}
                    {selectedOrder.payment_method} /{" "}
                    {selectedOrder.payment_status}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Order Status:</span>{" "}
                    {selectedOrder.order_status === "CANCELLED"
                      ? "CANCELLED"
                      : selectedOrder.order_status}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Total:</span>{" "}
                    {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-black bg-white p-5">
                <h2 className="text-lg font-semibold text-black">Items</h2>
                <div className="mt-4 space-y-3">
                  {detailLoading ? (
                    <p className="text-sm text-slate-500">Loading order...</p>
                  ) : (
                    selectedOrder.items?.map((item, index) => (
                      <div
                        key={`${selectedOrder.order_id}-${index}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center bg-no-repeat"
                            style={{
                              backgroundImage: item.image
                                ? `url(${getOrderItemImage(item.image)})`
                                : "linear-gradient(#e5e7eb, #d1d5db)",
                            }}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-black">
                              {item.product_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              Qty: {item.quantity}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.size && (
                                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-slate-700 ring-1 ring-gray-200">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] text-slate-700 ring-1 ring-gray-200">
                                  <span>Color:</span>
                                  <span
                                    className="h-3 w-3 rounded-full border border-black/10"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-black">
                          {formatCurrency(item.product_price)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        <h1 className="text-[2rem] font-bold tracking-tight text-black sm:text-3xl">
          {mode === "completed" ? "Completed Orders" : "Admin Dashboard"}
        </h1>

        {mode === "active" && (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-gray-50 p-2 text-black">
                    {card.icon}
                  </div>
                  <div className="text-right text-2xl font-bold leading-none text-black sm:text-[1.7rem]">
                    {card.value}
                  </div>
                </div>
                <div className="mt-3">
                  <h2 className="text-sm font-semibold text-black sm:text-[15px]">
                    {card.title}
                  </h2>
                  <p className={`mt-1 text-[11px] sm:text-xs ${card.subtextClass}`}>
                    {card.subtext}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-black bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold tracking-tight text-black">
            {mode === "completed" ? "Completed Orders" : "Active Orders"}
          </h2>

          <div className="mt-5 overflow-hidden border border-gray-200">
            <div className="hidden grid-cols-[1.1fr_1.3fr_1fr_0.8fr] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-black md:grid">
              <div>Order ID</div>
              <div>Customer / Items</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            <div className="space-y-3 p-3">
              {loading ? (
                <div className="p-4 text-sm text-slate-500">Loading orders...</div>
              ) : error ? (
                <div className="p-4 text-sm text-red-500">{error}</div>
              ) : visibleOrders.length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No orders found.</div>
              ) : (
                visibleOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer"
                    onClick={() => loadOrderDetail(order.id)}
                  >
                    <div className="grid gap-3 md:grid-cols-[1.1fr_1.3fr_1fr_0.8fr] md:items-center">
                      <div>
                        <p className="text-xs text-gray-500 md:hidden">Order ID</p>
                        <p className="text-sm font-semibold text-black">
                          {order.order_id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 md:hidden">Customer / Items</p>
                        <p className="text-sm font-medium text-black">
                          {order.full_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.items?.map((item) => item.product_name).join(", ") || "No items"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 md:hidden">Amount</p>
                        <p className="text-sm font-semibold text-black">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 md:hidden">Status</p>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            order.order_status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : order.order_status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : order.payment_status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : order.payment_status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.order_status === "CANCELLED"
                            ? "CANCELLED"
                            : order.order_status === "DELIVERED"
                            ? "DELIVERED"
                            : order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Orders;
