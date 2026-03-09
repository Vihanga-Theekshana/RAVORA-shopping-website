import Cartcard from "../components/Cartcard";

const Cart = () => {
  return (
    <>
      <div className="w-full h-150">
        <h1 className="text-2xl font-semibold p-5">Shopping Cart</h1>
        <div>
          <Cartcard price={1200} />
        </div>
        <div className="w-2/3 border-2 rounded-3xl h-80 m-8">
          <div className="text-2xl font-bold m-3">Order Summary</div>
          <div>
            <div className="flex justify-between">
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;
