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

  return (
    <div className="flex justify-center items-center p-8 mt-12 mb-12">
      <div className="max-w-6xl w-full px-6">
        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {filteritem?.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setselectedimage(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img
                    src={`http://localhost:8080/upload/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{filteritem?.name}</h1>

            <div className="mt-6">
              <p className="text-black">Rs {filteritem?.price}</p>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <p>{filteritem?.description}</p>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
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
