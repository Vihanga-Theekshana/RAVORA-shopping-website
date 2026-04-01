import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Navbar from "../components/common/Navbar/Navbar";
import Promovideo from "../components/Promovideo";
import Footer from "../components/common/footer/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Homepage = () => {
  //----------------------show more use state implement-----------------------
  const showitem = () => {
    setshowmore((showmore) => showmore + 5);
  };
  const [showmore, setshowmore] = useState(5);
  const [item, setitem] = useState([]);

  //----------------add useeffect for fetchdata -----------------------
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/item/home");
        setitem(res.data.item);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-9");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.15 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  //---------------------map item mean image url convert to object ---------------------
  const mapitem = item.map((value) => ({
    ...value,
    images: Array.isArray(value.images)
      ? value.images
      : JSON.parse(value.images || []),
  }));
  return (
    <>
      <Promovideo />
      <section
        data-reveal
        className="mx-auto w-full max-w-7xl translate-y-9 px-4 pt-8 opacity-0 transition-all duration-700 ease-out sm:px-6 sm:pt-10 lg:px-10"
      >
        <div className="flex justify-center text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Shop By Catagory
          </h1>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        {/* mens card */}

        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl sm:min-h-[340px] lg:min-h-[420px]">
          <div
            className="absolute inset-0 bg-[url('/src/assets/images/men.png')] bg-cover bg-center 
          transition-transform duration-500 ease-in-out hover:scale-110 over"
          ></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-4 text-center sm:gap-4">
            <h1 className="rounded-xl bg-gray-300/90 px-4 py-2 text-center text-lg font-semibold text-black sm:text-2xl">
              MEN'S CLOTHING
            </h1>
            <Link to="/Men">
              <button>
                <div className="group flex cursor-pointer items-center rounded-xl bg-black px-4 py-2 text-sm text-white sm:text-base">
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
            </Link>
          </div>
        </div>
        {/* women card */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl sm:min-h-[340px] lg:min-h-[420px]">
          <div className="absolute inset-0 bg-[url('/src/assets/images/women.png')] bg-cover bg-center transition  duration-500 ease-in-out hover:-translate-y-1 hover:scale-110"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-4 text-center sm:gap-4">
            <h1 className="rounded-xl bg-gray-300/90 px-4 py-2 text-center text-lg font-semibold text-black sm:text-2xl">
              WOMEN'S CLOTHING
            </h1>
            <Link to="/Women">
              <button>
                <div className="group flex cursor-pointer items-center rounded-xl bg-black px-4 py-2 text-sm text-white sm:text-base">
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
            </Link>
          </div>
        </div>
        </div>
      </section>
      {/* items */}

      <section
        data-reveal
        className="mx-auto w-full max-w-7xl translate-y-9 px-4 py-8 opacity-0 transition-all duration-700 ease-out sm:px-6 lg:px-10"
      >
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        {mapitem.slice(0, showmore).map((value) => {
          return (
            <div key={value.id}>
              <Itemcard
                title={value.name}
                price={value.price}
                id={value.id}
                inStock={value.in_stock !== 0}
                img={
                  value.images?.length > 0
                    ? `http://localhost:8080/upload/${value.images[0]}` //pass image url
                    : ""
                }
              />
            </div>
          );
        })}
        </div>
      </section>
      <div
        data-reveal
        className="flex translate-y-9 items-center justify-center px-4 pb-8 opacity-0 transition-all duration-700 ease-out sm:pb-10"
      >
        <div>
          {showmore < mapitem.length && (
            <button
              className="cursor-pointer rounded-sm border-2 border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black"
              onClick={showitem}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Homepage;
