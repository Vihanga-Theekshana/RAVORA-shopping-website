import { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "./Searchbar";
import { Link, useLocation, useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handelusericonclick = async () => {
    const token = localStorage.getItem("token");

    if (
      !token &&
      (location.pathname === "/Login" ||
        location.pathname === "/Signup" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/verify-otp" ||
        location.pathname === "/reset-password")
    ) {
      return;
    }

    if (!token) {
      navigate("/Login", { state: { backgroundLocation: location } });
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      navigate("/Login", { state: { backgroundLocation: location } });
      console.error(err);
    }
  };

  const handlecartclick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login", { state: { backgroundLocation: location } });
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="relative z-50 border-b-2 border-gray-300 bg-white">
      <div className="relative z-10 grid min-h-18 grid-cols-[4.5rem_1fr_4.5rem] items-center px-4 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-6">
        <div className="flex w-[4.5rem] items-center justify-start lg:hidden">
          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-none outline-none ring-0 focus:outline-none focus:ring-0"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-7"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        <h1 className="text-center text-2xl font-bold sm:text-3xl lg:justify-self-start lg:text-left">
          RAVORA
        </h1>

        <ul className="hidden lg:flex lg:items-center lg:justify-center lg:gap-6 xl:gap-10">
          <li>
            <Link to="/">
              <button className="cursor-pointer font-semibold transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                Home
              </button>
            </Link>
          </li>
          <li>
            <Link to="/Men">
              <button className="cursor-pointer font-semibold transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                Men's Clothing
              </button>
            </Link>
          </li>
          <li>
            <Link to="/Women">
              <button className="cursor-pointer font-semibold transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                Women's Clothing
              </button>
            </Link>
          </li>
        </ul>

        <div className="hidden items-center justify-end gap-4 self-center justify-self-end lg:flex">
          <div className="w-64">
            <Searchbar />
          </div>
          <div className="flex items-center justify-center gap-4 self-center">
            <button
              className="flex cursor-pointer items-center justify-center border-none outline-none ring-0 focus:outline-none focus:ring-0"
              onClick={handlecartclick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
            </button>

            <button
              className="flex cursor-pointer items-center justify-center border-none outline-none ring-0 focus:outline-none focus:ring-0"
              onClick={handelusericonclick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex w-[4.5rem] items-center justify-end gap-1 lg:hidden">
          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-none outline-none ring-0 focus:outline-none focus:ring-0"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
            }}
            aria-label="Open search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-none outline-none ring-0 focus:outline-none focus:ring-0"
            aria-label="Cart"
            onClick={handlecartclick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 pb-4 lg:hidden">
          <Searchbar />
        </div>
      )}

      {menuOpen && (
        <div className="flex flex-col gap-4 px-4 pb-4 lg:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <button className="w-full cursor-pointer rounded-lg border-none py-2 text-left font-semibold outline-none ring-0 hover:bg-gray-100 focus:outline-none focus:ring-0">
              Home
            </button>
          </Link>

          <Link to="/Men" onClick={() => setMenuOpen(false)}>
            <button className="w-full cursor-pointer rounded-lg border-none py-2 text-left font-semibold outline-none ring-0 hover:bg-gray-100 focus:outline-none focus:ring-0">
              Men's Clothing
            </button>
          </Link>

          <Link to="/Women" onClick={() => setMenuOpen(false)}>
            <button className="w-full cursor-pointer rounded-lg border-none py-2 text-left font-semibold outline-none ring-0 hover:bg-gray-100 focus:outline-none focus:ring-0">
              Women's Clothing
            </button>
          </Link>
          {token ? (
            <div className="flex items-center pt-2">
                <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-black bg-black px-4 py-2 font-semibold text-white outline-none ring-0 transition hover:bg-gray-800 focus:outline-none focus:ring-0"
                onClick={() => {
                  setMenuOpen(false);
                  handelusericonclick();
                }}
                >
                  <span>Account</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/Login"
                state={{ backgroundLocation: location }}
                onClick={() => setMenuOpen(false)}
              >
                <button className="w-full cursor-pointer rounded-lg border border-black px-4 py-2 text-center font-semibold text-black outline-none ring-0 focus:outline-none focus:ring-0">
                  Login
                </button>
              </Link>
              <Link
                to="/Signup"
                state={{ backgroundLocation: location }}
                onClick={() => setMenuOpen(false)}
              >
                <button className="w-full cursor-pointer rounded-lg bg-black px-4 py-2 text-center font-semibold text-white outline-none ring-0 focus:outline-none focus:ring-0">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
