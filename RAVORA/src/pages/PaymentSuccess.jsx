import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <section className="bg-zinc-100 px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[1.25rem] border border-zinc-300 bg-white shadow-[0_14px_35px_rgba(0,0,0,0.08)]">
          <div className="bg-[linear-gradient(135deg,#111111_0%,#2a2a2a_48%,#575757_100%)] px-4 py-6 text-white sm:px-6 sm:py-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl ring-1 ring-white/15 backdrop-blur">
              ✓
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300 sm:text-[11px]">
              Payment Successful
            </p>
            <h1 className="mt-2 max-w-xl text-xl font-bold tracking-tight sm:text-2xl">
              Your RAVORA order has been placed successfully.
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-300 sm:text-sm">
              We received your payment and your order is now being processed.
              You can continue shopping or review your account for updates.
            </p>
          </div>

          <div className="grid gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1.05fr)_220px]">
            <div className="space-y-3">
              <div className="rounded-[1rem] border border-zinc-200 bg-zinc-100 p-3.5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                  Order Reference
                </p>
                <p className="mt-2 break-all text-base font-semibold text-zinc-950 sm:text-lg">
                  {orderId || "Your order reference will appear here"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-zinc-200 p-3.5">
                  <h2 className="text-sm font-semibold">What happens next</h2>
                  <p className="mt-2 text-xs leading-5 text-zinc-600 sm:text-sm">
                    Our team will confirm and prepare your order for delivery as
                    quickly as possible.
                  </p>
                </div>

                <div className="rounded-[1rem] border border-zinc-200 p-3.5">
                  <h2 className="text-sm font-semibold">Need another item?</h2>
                  <p className="mt-2 text-xs leading-5 text-zinc-600 sm:text-sm">
                    Your payment is complete, so you can safely continue
                    browsing and place a new order anytime.
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-[1rem] border border-zinc-200 bg-zinc-50 p-3.5">
              <h2 className="text-sm font-semibold sm:text-base">
                Quick Actions
              </h2>
              <p className="mt-2 text-xs leading-5 text-zinc-600 sm:text-sm">
                Keep exploring the store or head to your dashboard.
              </p>

              <div className="mt-5 space-y-2.5">
                <Link
                  to="/"
                  className="flex h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:text-sm"
                >
                  Back to Home
                </Link>

                <Link
                  to="/user"
                  className="flex h-10 items-center justify-center rounded-full border border-zinc-950 px-4 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-950 hover:text-white sm:text-sm"
                >
                  View Dashboard
                </Link>

                <Link
                  to="/Men"
                  className="flex h-10 items-center justify-center rounded-full border border-zinc-300 px-4 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 sm:text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
