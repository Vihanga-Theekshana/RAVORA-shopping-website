import { useState } from "react";
import Cartcard from "../components/Cartcard";

const Cart = () => {
  const [subtotal, setsubtotal] = useState(0);
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold  pt-10 pb-3">Shopping Cart</h1>
      <div className="w-2/3 h-150">
        <div>
          <Cartcard price={1200} setsubtotal={setsubtotal} name={"shirt"} />
        </div>
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
