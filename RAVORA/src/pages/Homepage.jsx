import Navbar from "../components/Navbar/Navbar";
import Promovideo from "../components/Promovideo";

const Homepage = () => {
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
    </>
  );
};
export default Homepage;
