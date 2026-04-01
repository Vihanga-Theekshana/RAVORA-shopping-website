import { useState } from "react";
import Product from "./Product";
import Additem from "./Additem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";

const Admin = () => {
  const navigate = useNavigate();
  const dashboardicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const product = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z"
      />
    </svg>
  );

  const additem = (
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
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );

  const completedOrders = (
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );

  const sidebarLinks = [
    { name: "Orders", path: "/", icon: dashboardicon },
    { name: "Completed Orders", path: "/completed-orders", icon: completedOrders },
    { name: "Product", path: "/overview", icon: product },
    { name: "Add Item", path: "/chat", icon: additem },
  ];
  const [value, setvalue] = useState("Orders");

  const buttonclick = (value) => {
    setvalue(value);
  };

  const handellogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("You have logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error(err + "Logout failed");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-gray-300 bg-white px-4 py-3 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="flex items-baseline gap-2"></div>
        <div className="flex items-center justify-between gap-5 text-black sm:justify-end">
          <p>Hi! Admin</p>
          <button
            className="border text-black rounded-full text-sm px-4 py-1 hover:bg-black hover:text-white cursor-pointer"
            onClick={handellogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-row overflow-x-auto border-b border-gray-300 pt-2 text-base transition-all duration-300 md:h-[550px] md:w-64 md:flex-col md:border-b-0 md:border-r md:pt-4">
          {sidebarLinks.map((item, index) => (
            <button
              onClick={() => buttonclick(item.name)}
              href={item.path}
              key={index}
              className={`flex shrink-0 items-center gap-3 px-4 py-3 
                            ${
                              item.name === value
                                ? "border-r-4 md:border-r-[6px] bg-gray-200  border-black-500 text-black-500"
                                : "hover:bg-gray-100/90 border-white text-gray-700"
                            }`}
            >
              {item.icon}
              <p className="hidden md:block text-left text-sm leading-5">
                {item.name}
              </p>
            </button>
          ))}
        </div>
        <div className="w-full">
          {value === "Product" && <Product />}
          {value === "Add Item" && <Additem />}
          {value === "Orders" && <Orders mode="active" />}
          {value === "Completed Orders" && <Orders mode="completed" />}
        </div>
      </div>
    </>
  );
};
export default Admin;
