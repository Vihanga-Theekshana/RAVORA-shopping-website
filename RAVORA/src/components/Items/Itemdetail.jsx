import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const Itemdetail = () => {
  const { id } = useParams();
  const [item, setitem] = useState([]);
  const [selectedimage, setselectedimage] = useState(null);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/item/getitemdetail",
          { params: { id } }, //request get
        );
        setitem(res.data.item);
        setselectedimage(null);
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
      await axios.post(
        "http://localhost:8080/api/item/additem/addtocart",
        { product_id: id, user_id: user_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.log(err);
    }
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

            <div className="mt-10 flex flex-col gap-4 text-base sm:flex-row sm:items-center">
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                onClick={addcarthandel}
              >
                Add to Cart
              </button>
              <button className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition">
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
