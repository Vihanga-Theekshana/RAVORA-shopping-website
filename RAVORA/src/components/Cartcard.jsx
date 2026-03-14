import { useEffect, useState } from "react";

const Cartcard = ({ name, price, onTotalChange, image, id }) => {
  const [count, setcount] = useState(1);
  const counthandel = (value) => {
    if (value == "add") {
      setcount((prv) => prv + 1);
    } else if (value == "minus" && count > 0) {
      setcount((prv) => prv - 1);
    }
  };
  const total = price * count;
  useEffect(() => {
    onTotalChange(id, total);
  }, [id, onTotalChange, total]);
  return (
    <>
      <div className="mt-3 flex w-full flex-col gap-4 rounded-2xl border-2 border-gray-300 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <div
            className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center bg-no-repeat sm:h-25 sm:w-25"
            style={{
              backgroundImage: image
                ? `url(${image})`
                : "linear-gradient(#e5e7eb, #d1d5db)",
            }}
          ></div>
          <div className="flex flex-col gap-2 py-1 sm:p-3">
            <div className="text-sm font-medium sm:text-base">{name}</div>
            <div className="text-sm sm:text-base">Rs.{price}</div>
            <div className="flex items-center">
              <button
                className="cursor-pointer"
                onClick={() => counthandel("minus")}
              >
                <div className="border-2 p-0.2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </div>
              </button>
              <div className="w-10 flex justify-center">{count}</div>
              <button
                className="cursor-pointer"
                onClick={() => counthandel("add")}
              >
                <div className="border-2 p-0.2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 self-end text-right sm:self-auto sm:p-5">
          <div>Rs {total}.00</div>
          <button className="flex items-center gap-1 text-red-500 cursor-pointer">
            <div>Remove</div>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
export default Cartcard;
