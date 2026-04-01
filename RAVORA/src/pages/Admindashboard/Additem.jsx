import axios from "axios";
import { useMemo, useState } from "react";
import { notifyError, notifySuccess } from "../../utils/notify";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const IMAGE_SLOTS = 4;

const Additem = () => {
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [category, setcategory] = useState("");
  const [price, setprice] = useState("");
  const [offerprice, setofferprice] = useState("");
  const [images, setimages] = useState(Array(IMAGE_SLOTS).fill(null));
  const [preview, setpreview] = useState(Array(IMAGE_SLOTS).fill(null));
  const [sizes, setSizes] = useState([]);
  const [colorInput, setColorInput] = useState("#000000");
  const [colors, setColors] = useState([]);
  const cardPreviewImage = useMemo(
    () => preview.find(Boolean) || "",
    [preview],
  );

  const handelimage = (index, file) => {
    if (!file) {
      return;
    }

    setimages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });

    setpreview((prev) => {
      const updated = [...prev];
      updated[index] = URL.createObjectURL(file);
      return updated;
    });
  };

  const handleRemoveImage = (index) => {
    setimages((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    setpreview((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handleSizeToggle = (selectedSize) => {
    setSizes((prev) =>
      prev.includes(selectedSize)
        ? prev.filter((size) => size !== selectedSize)
        : [...prev, selectedSize],
    );
  };

  const handleAddColor = () => {
    const normalizedColor = colorInput.toLowerCase();
    setColors((prev) =>
      prev.includes(normalizedColor) ? prev : [...prev, normalizedColor],
    );
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors((prev) => prev.filter((color) => color !== colorToRemove));
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("catagory", category);
    formdata.append("price", price);
    formdata.append("offerprice", offerprice);
    sizes.forEach((size) => formdata.append("sizes", size));
    colors.forEach((color) => formdata.append("colors", color));

    images.filter(Boolean).forEach((img) => {
      formdata.append("images", img);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/admin/additem", formdata, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notifySuccess("Product added successfully");
    } catch (err) {
      console.error(err);
      notifyError(err.response?.data?.message || "Failed to add product");
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
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: IMAGE_SLOTS }).map((_, index) => (
                <label
                  key={index}
                  className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-400/70 bg-gray-50"
                >
                  <input
                    accept="image/*"
                    type="file"
                    name={`image-${index + 1}`}
                    hidden
                    onChange={(e) => handelimage(index, e.target.files?.[0])}
                  />
                  {preview[index] ? (
                    <>
                      <img
                        src={preview[index]}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-sm text-white cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage(index);
                        }}
                      >
                        x
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <img
                        className="max-w-10"
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                        alt="uploadArea"
                        width={40}
                        height={40}
                      />
                      <span className="mt-1 text-xs">Upload</span>
                    </div>
                  )}
                </label>
              ))}
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
              className="outline-none md:py-2.5 py-2 px-3 rounded-2xl border border-gray-500/40"
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
              className="outline-none md:py-2.5 py-2 px-3 rounded-2xl border border-gray-500/40 resize-none"
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
              className="outline-none md:py-2.5 py-2 px-3 rounded-2xl border border-gray-500/40"
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
          <div className="flex flex-col gap-2 max-w-md">
            <label className="text-base font-medium">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <label
                  key={size}
                  className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                    sizes.includes(size)
                      ? "border-black bg-black text-white"
                      : "border-gray-400/40 bg-white text-black"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <label className="text-base font-medium">Available Colors</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-2xl border border-gray-400/40 bg-white p-1"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Add Color
              </button>
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="flex items-center gap-2 rounded-2xl border border-gray-300 px-2 py-1"
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/20"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="text-xs uppercase">{color}</span>
                    <button
                      type="button"
                      className="cursor-pointer text-xs text-red-500"
                      onClick={() => handleRemoveColor(color)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                className="outline-none md:py-2.5 py-2 px-3 rounded-2xl border border-gray-500/40"
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
                className="outline-none md:py-2.5 py-2 px-3 rounded-2xl border border-gray-500/40"
                value={offerprice}
                onChange={(e) => setofferprice(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-8 py-2.5 bg-black text-white font-medium rounded-2xl cursor-pointer hover:bg-gray-500"
          >
            ADD
          </button>
        </form>
      </div>
      <div className="w-full px-4 pb-10 sm:px-6 lg:px-10 lg:pb-0 lg:pr-16 lg:pt-24 xl:pr-24 xl:pt-40">
        <div className="w-full max-w-60">
          <div className="flex flex-col gap-2">
            <div
              key={cardPreviewImage || "empty-preview"}
              className="w-full h-80  bg-cover bg-center rounded-2xl bg-gray-400"
              // get background image
              style={{
                backgroundImage: cardPreviewImage
                  ? `url("${cardPreviewImage}")`
                  : "",
              }}
            ></div>
            <div className="w-full h-20 flex flex-col gap-2">
              <h1 className="font-semibold pl-1 pr-1 leading-tight">{name}</h1>
              <h3 className="pl-1 pr-1 ">Rs {price}</h3>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-2xl border border-black px-2 py-0.5 text-xs"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full border border-black/20"
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Additem;
