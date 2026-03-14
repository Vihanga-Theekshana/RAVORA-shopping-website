import axios from "axios";
import { useState } from "react";
import Itemcard from "../../components/Items/Itemcard";
const Additem = () => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [category, setcategory] = useState("");
  const [price, setprice] = useState("");
  const [offerprice, setofferprice] = useState("");
  const [images, setimages] = useState([]);
  const [preview, setpreview] = useState(null);

  const handelimage = (e) => {
    const files = Array.from(e.target.files);
    setimages(files);
    const file = files[0];
    setpreview(URL.createObjectURL(file));
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("catagory", category);
    formdata.append("price", price);
    formdata.append("offerprice", offerprice);

    images.forEach((img) => {
      formdata.append("images", img);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/admin/additem", formdata, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product Added Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-full flex-col lg:flex-row">
      <div className="flex w-full flex-col bg-white py-6 sm:py-10">
        <form
          className="max-w-lg space-y-5 p-4 sm:p-6 md:p-10"
          onSubmit={handelsubmit}
        >
          <div>
            <p className="text-base font-medium">Product Image</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <label>
                <input
                  accept="image/*"
                  type="file"
                  name="images"
                  multiple
                  hidden
                  onChange={handelimage}
                />
                <img
                  className="max-w-24 cursor-pointer"
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                  alt="uploadArea"
                  width={100}
                  height={100}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              placeholder="Type here"
            ></textarea>
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {[{ name: "Mensclothing" }, { name: "Womensclothing" }].map(
                (item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="product-price">
                Product Price
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                value={price}
                onChange={(e) => setprice(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="offer-price">
                Offer Price
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                value={offerprice}
                onChange={(e) => setofferprice(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-8 py-2.5 bg-black text-white font-medium rounded cursor-pointer hover:bg-gray-500"
          >
            ADD
          </button>
        </form>
      </div>
      <div className="px-4 pb-10 sm:px-6 lg:px-10 lg:pb-0 lg:pr-16 lg:pt-24 xl:pr-24 xl:pt-40">
        <div className="w-full max-w-60">
          <div className="flex flex-col gap-2">
            <div
              className="w-full h-80  bg-cover bg-center rounded-xl bg-gray-400"
              // get background image
              style={{
                backgroundImage: preview ? `url(${preview})` : "",
              }}
            ></div>
            <div className="w-full h-20 flex flex-col gap-2">
              <h1 className="font-semibold pl-1 pr-1 leading-tight">{name}</h1>
              <h3 className="pl-1 pr-1 ">Rs {price}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Additem;
