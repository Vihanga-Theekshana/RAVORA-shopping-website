import { useState } from "react";
import Product from "./Product";
import Additem from "./Additem";

const Admin = () => {
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

  const sidebarLinks = [
    { name: "Dashboard", path: "/", icon: dashboardicon },
    { name: "Product", path: "/overview", icon: product },
    { name: "Add Item", path: "/chat", icon: additem },
  ];
  const [value, setvalue] = useState("");

  const buttonclick = (value) => {
    setvalue(value);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <div className="flex items-baseline gap-2"></div>
        <div className="flex text-black items-center gap-5 ">
          <p>Hi! Admin</p>
          <button className="border text-black rounded-full text-sm px-4 py-1">
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item, index) => (
            <button
              onClick={() => buttonclick(item.name)}
              href={item.path}
              key={index}
              className={`flex items-center py-3 px-4 gap-3 
                            ${
                              item.name === value
                                ? "border-r-4 md:border-r-[6px] bg-gray-200  border-black-500 text-black-500"
                                : "hover:bg-gray-100/90 border-white text-gray-700"
                            }`}
            >
              {item.icon}
              <p className="md:block hidden text-center">{item.name}</p>
            </button>
          ))}
        </div>
        <div className="w-full">
          {value === "Product" && <Product />}
          {value === "Add Item" && <Additem />}
        </div>
      </div>
    </>
  );
};
export default Admin;
