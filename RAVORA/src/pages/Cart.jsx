import { useCallback, useEffect, useState } from "react";
import Cartcard from "../components/Cartcard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Cart = () => {
  const navigate = useNavigate();
  const [item, setitem] = useState([]);
  const [itemTotals, setItemTotals] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
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

  const handleItemTotalChange = useCallback((id, total) => {
    setItemTotals((prev) => {
      if (prev[id] === total) {
        return prev;
      }
      return {
        ...prev,
        [id]: total,
      };
    });
  }, []);
  const handleItemQuantityChange = useCallback((id, quantity) => {
    setItemQuantities((prev) => {
      if (prev[id] === quantity) {
        return prev;
      }
      return {
        ...prev,
        [id]: quantity,
      };
    });
  }, []);
  const subtotal = Object.values(itemTotals).reduce(
    (sum, value) => sum + value,
    0,
  );
  const handleRemoveItem = (id) => {
    setitem((prev) => prev.filter((item) => item.id !== id));
    setItemTotals((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setItemQuantities((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };
  const mapitem = item.map((value) => ({
    ...value,
    images: normalizeImages(value.images),
  }));
  const checkoutItems = mapitem.map((value) => ({
    ...value,
    quantity: itemQuantities[value.id] ?? value.quantity ?? value.qty ?? 1,
  }));
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
                onQuantityChange={handleItemQuantityChange}
                name={value.name}
                onRemove={handleRemoveItem}
                quantity={itemQuantities[value.id] ?? value.quantity ?? value.qty ?? 1}
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
              <button
                onClick={() => {
                  localStorage.setItem("checkoutSubtotal", String(subtotal));
                  localStorage.setItem(
                    "checkoutItems",
                    JSON.stringify(checkoutItems),
                  );
                  navigate("/checkout", {
                    state: { subtotal, item: checkoutItems },
                  });
                }}
                className="h-10 w-full cursor-pointer rounded-3xl bg-black text-white sm:w-1/2 lg:w-1/3"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate("/")}
                className="h-10 w-full cursor-pointer rounded-3xl border-2 sm:w-1/2 lg:w-1/3"
              >
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
