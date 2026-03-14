import { useEffect, useState } from "react";
import Cartcard from "../components/Cartcard";
import axios from "axios";

const Cart = () => {
  const [item, setitem] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8080/api/item/getitem/getcart",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setitem(res.data.cart);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);
  const mapitem = item.map((value) => ({
    ...value,
    images: Array.isArray(value.images)
      ? value.images
      : JSON.parse(value.images || "[]"),
  }));
  const [itemTotals, setItemTotals] = useState({});
  const handleItemTotalChange = (id, total) => {
    setItemTotals((prev) => ({
      ...prev,
      [id]: total,
    }));
  };
  const subtotal = Object.values(itemTotals).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <div className="flex flex-col items-center px-4 sm:px-6">
      <h1 className="pb-3 pt-8 text-center text-2xl font-semibold sm:pt-10">
        Shopping Cart
      </h1>
      <div className="h-auto w-full max-w-5xl">
        {mapitem.map((value) => {
          return (
            <div key={value.id}>
              <Cartcard
                id={value.id}
                price={value.price}
                onTotalChange={handleItemTotalChange}
                name={value.name}
                image={
                  value.images?.length > 0
                    ? `http://localhost:8080/upload/${value.images[0]}` //pass image url
                    : ""
                }
              />
            </div>
          );
        })}

        <div className="mx-auto my-6 w-full rounded-3xl border-2 border-gray-400 p-4 sm:my-8 sm:p-6">
          <div className="mb-4 text-xl font-bold sm:text-2xl">
            Order Summary
          </div>
          <div>
            <div className="mb-1 flex justify-between gap-4 text-sm sm:text-base">
              <div>Subtotal</div>
              <div>Rs {subtotal}.00</div>
            </div>
            <div className="flex justify-between gap-4 text-sm sm:text-base">
              <div>Shipping</div>
              <div className="text-right">Calculated at checkout</div>
            </div>
            <hr className="w-full h-1 bg-gray-200 border-none mx-auto my-3" />
            <div className="mb-1 flex justify-between gap-4 text-sm sm:text-base">
              <div className="font-bold">Total</div>
              <div className="font-bold">Rs {subtotal}.00</div>
            </div>
            <hr className="w-full h-1 bg-gray-200 border-none mx-auto my-3" />
            <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="h-10 w-full cursor-pointer rounded-3xl bg-black text-white sm:w-1/2 lg:w-1/3">
                Proceed to Checkout
              </button>
              <button className="h-10 w-full cursor-pointer rounded-3xl border-2 sm:w-1/2 lg:w-1/3">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
