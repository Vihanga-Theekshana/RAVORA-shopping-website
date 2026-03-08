import { useState } from "react";
import img1 from "../assets/images/m1.png";
const Cartcard = () => {
  const [count, setcount] = useState(0);
  const counthandel = (value) => {
    if (value == "add") {
      setcount((prv) => prv + 1);
    } else {
      setcount((prv) => prv - 1);
    }
  };
  return (
    <>
      <div className="justify-between border-2 w-2/3 h-30 flex rounded-2xl m-8">
        <div className="flex">
          <img className="w-30 h-30 p-3" src={img1}></img>
          <div className="flex items-center">
            <button className="cursor-pointer" onClick={counthandel}>
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
        <div></div>
      </div>
    </>
  );
};
export default Cartcard;
