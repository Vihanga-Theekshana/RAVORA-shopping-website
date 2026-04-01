import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const normalizeSizes = (sizes) => {
  if (Array.isArray(sizes)) {
    return sizes;
  }

  try {
    return JSON.parse(sizes || "[]");
  } catch {
    return [];
  }
};

const normalizeColors = (colors) => {
  if (Array.isArray(colors)) {
    return colors;
  }

  try {
    return JSON.parse(colors || "[]");
  } catch {
    return [];
  }
};

const Itemdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setitem] = useState([]);
  const [selectedimage, setselectedimage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/item/getitemdetail",
          { params: { id } }, //request get
        );
        setitem(res.data.item);
        setselectedimage(null);
        setQuantity(1);
        setSelectedSize("");
        setSelectedColor("");
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, [id]);
  // filter item each category and convert images string to object
  const filteritems = item.map((value) => ({
    ...value,
    images: Array.isArray(value.images)
      ? value.images
      : JSON.parse(value.images || "[]"),
    sizes: normalizeSizes(value.sizes),
    colors: normalizeColors(value.colors),
  }));
  const filteritem = filteritems[0];
  // loading
  if (!filteritem) {
    return (
      <div className="flex justify-center items-center p-8 mt-12 mb-12">
        Loading...
      </div>
    );
  }
  const mainimage = selectedimage || filteritem?.images?.[0];
  const thumbnail = mainimage
    ? `http://localhost:8080/upload/${mainimage}`
    : "";

  const addcarthandel = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      if (filteritem?.sizes?.length > 0 && !selectedSize) {
        alert("Please select a size");
        return;
      }
      if (filteritem?.colors?.length > 0 && !selectedColor) {
        alert("Please select a color");
        return;
      }
      await axios.post(
        "http://localhost:8080/api/item/additem/addtocart",
        {
          product_id: id,
          user_id: user_id,
          quantity,
          size: selectedSize || null,
          color: selectedColor || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "add" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleBuyNow = () => {
    if (filteritem?.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (filteritem?.colors?.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    const checkoutItem = {
      ...filteritem,
      quantity,
      size: selectedSize || null,
      color: selectedColor || null,
    };
    const subtotal = Number(filteritem?.price || 0) * quantity;

    localStorage.setItem("checkoutSubtotal", String(subtotal));
    localStorage.setItem("checkoutItems", JSON.stringify([checkoutItem]));

    navigate("/checkout", {
      state: {
        subtotal,
        item: [checkoutItem],
      },
    });
  };
  return (
    <div className="my-8 flex items-center justify-center px-4 py-4 sm:my-12 sm:px-6">
      <div className="w-full max-w-6xl">
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 sm:flex-col sm:overflow-visible sm:pb-0">
              {filteritem?.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setselectedimage(image)}
                  className="w-20 shrink-0 cursor-pointer overflow-hidden rounded border border-gray-500/30 sm:max-w-24"
                >
                  <img
                    src={`http://localhost:8080/upload/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded border border-gray-500/30 sm:max-w-[420px] lg:max-w-[500px]">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full text-sm lg:w-1/2">
            <h1 className="text-2xl font-medium sm:text-3xl">
              {filteritem?.name}
            </h1>

            <div className="mt-6">
              <p className="text-black">Rs {filteritem?.price}</p>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <p>{filteritem?.description}</p>

            {filteritem?.sizes?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-black">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {filteritem.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 cursor-pointer rounded border px-3 py-2 text-sm transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteritem?.colors?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-black">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {filteritem.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 transition ${
                          isSelected ? "border-black scale-105" : "border-gray-300"
                        }`}
                        title={color}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        ></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-2.5">
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center border border-black text-black transition hover:bg-gray-100"
                onClick={() => handleQuantityChange("minus")}
              >
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
                    d="M5 12h14"
                  />
                </svg>
              </button>

              <div className="flex min-w-5 justify-center text-xl text-black">
                {quantity}
              </div>

              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center border border-black text-black transition hover:bg-gray-100"
                onClick={() => handleQuantityChange("add")}
              >
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-4 text-base sm:flex-row sm:items-center">
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                onClick={addcarthandel}
                disabled={filteritem?.in_stock === 0}
              >
                {filteritem?.in_stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-black text-white transition"
                onClick={handleBuyNow}
                disabled={filteritem?.in_stock === 0}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Itemdetail;
