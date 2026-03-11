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

  const [subtotal, setsubtotal] = useState(0);
  return (
    <div className="flex flex-col items-center ">
      <h1 className="text-2xl font-semibold  pt-10 pb-3">Shopping Cart</h1>
      <div className="w-2/3 h-auto">
        {mapitem.map((value) => {
          return (
            <div key={value.id}>
              <Cartcard
                price={value.price}
                setsubtotal={setsubtotal}
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

        <div className="w-full border-2 border-gray-400 rounded-3xl mx-auto h-70 m-8">
          <div className="text-2xl font-bold m-3">Order Summary</div>
          <div>
            <div className="flex justify-between ml-8 mr-8 mb-1">
              <div>Subtotal</div>
              <div>Rs {subtotal}.00</div>
            </div>
            <div className="flex justify-between ml-8 mr-8">
              <div>Shipping</div>
              <div>Calculated at checkout</div>
            </div>
            <hr className="w-full h-1 bg-gray-200 border-none mx-auto my-3" />
            <div className="flex justify-between ml-8 mr-8 mb-1">
              <div className="font-bold">Total</div>
              <div className="font-bold">Rs {subtotal}.00</div>
            </div>
            <hr className="w-full h-1 bg-gray-200 border-none mx-auto my-3" />
            <div className="w-full flex  gap-3 justify-center mt-5  items-center">
              <button className="w-1/3 h-10 bg-black text-white rounded-3xl cursor-pointer">
                Proceed to Checkout
              </button>
              <button className="w-1/3 h-10 border-2 rounded-3xl cursor-pointer">
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
