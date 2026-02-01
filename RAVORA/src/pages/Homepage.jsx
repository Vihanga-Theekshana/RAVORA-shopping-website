import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Navbar from "../components/common/Navbar/Navbar";
import Promovideo from "../components/Promovideo";
import Footer from "../components/common/footer/Footer";

const Homepage = () => {
  const showitem = () => {
    setshowmore((showmore) => showmore + 5);
  };
  const [showmore, setshowmore] = useState(5);
  const items = [
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
  ];
  return (
    <>
      <Navbar />
      <Promovideo />
      <div className=" flex justify-center pt-5">
        <h1 className="text-3xl font-bold">Shop By Catagory</h1>
      </div>

      <div className="flex">
        {/* mens card */}
        <div className=" flex relative overflow-hidden justify-center items-center w-1/2  h-80 mt-10 ml-10 mb-10 mr-5 rounded-xl ">
          <div
            className="absolute inset-0 bg-[url('/images/men.png')] bg-cover bg-center 
          transition-transform duration-500 ease-in-out hover:scale-110 over"
          ></div>
          <div className="relative z-10 flex flex-col gap-3 justify-center items-center">
            <h1 className="text-2xl p-2 rounded-xl bg-gray-300 text-black">
              MEN'S CLOTHING
            </h1>
            <button>
              <div className="flex group items-center bg-black text-lg text-white p-2 rounded-xl cursor-pointer">
                <h1>Explore now</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 font-bold transition-transform duration-300 group-hover:translate-x-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
        {/* women card */}
        <div className="flex relative justify-center items-center w-1/2    h-80 mt-10 ml-5 mb-10 mr-10 rounded-xl overflow-hidden ">
          <div className="absolute inset-0 bg-[url('/images/women.png')] bg-cover bg-center transition  duration-500 ease-in-out hover:-translate-y-1 hover:scale-110"></div>
          <div className="relative z-10 flex flex-col gap-3 justify-center items-center">
            <h1 className=" text-2xl p-2 rounded-xl bg-gray-300 text-black">
              WOMEN'S CLOTHING
            </h1>
            <button>
              <div className="flex group items-center bg-black text-lg text-white p-2 rounded-xl cursor-pointer">
                <h1>Explore now</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 font-bold transition-transform duration-300 group-hover:translate-x-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* items */}

      <div className="grid grid-cols-5 gap-6 m-10">
        {items.slice(0, showmore).map((value) => {
          return (
            <div>
              <Itemcard
                title={value.title}
                price={value.price}
                img={value.img}
              />
            </div>
          );
        })}
      </div>
      <div className="pb-6 flex justify-center items-center">
        <div>
          {showmore < items.length && (
            <button
              className="bg-black hover:bg-white hover:text-black hover:border-2 hover:border-black text-white pl-2 pr-2 pt-1 pb-1 rounded-sm text-sm cursor-pointer"
              onClick={showitem}
            >
              Show more
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Homepage;
