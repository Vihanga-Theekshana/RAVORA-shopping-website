import axios from "axios";
import { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../../utils/notify";

const Product = () => {
  const [item, setitem] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerprice: "",
  });

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios("http://localhost:8080/api/item/mensclothing");
        setitem(res.data.item);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);

  const filteritem = item.map((value) => ({
    ...value,
    images: Array.isArray(value.images)
      ? value.images
      : JSON.parse(value.images || "[]"),
  }));

  const deletehandel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/admin/deleteitem",
        { id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setitem((prv) => prv.filter((product) => product.id !== id));
      notifySuccess("Deleted successfully");
    } catch (err) {
      console.log(err);
      notifyError(err.response?.data?.message || "Failed to delete item");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      offerprice: product.offerPrice || "",
    });
  };

  const handleStockToggle = async (id, checked) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8080/api/admin/togglestock",
        { id, inStock: checked },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setitem((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, in_stock: checked ? 1 : 0 }
            : product,
        ),
      );
      notifySuccess(checked ? "Marked as in stock" : "Marked as out of stock");
    } catch (err) {
      console.log(err);
      notifyError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8080/api/admin/updateitem",
        { id: editingProduct.id, ...form },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setitem((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: form.name,
                description: form.description,
                category: form.category,
                price: form.price,
                offerPrice: form.offerprice,
              }
            : product,
        ),
      );
      setEditingProduct(null);
      notifySuccess("Product updated successfully");
    } catch (err) {
      console.log(err);
      notifyError(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between py-1">
      <div className="w-full p-4 md:p-10">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex w-full max-w-5xl flex-col items-center overflow-x-auto rounded-2xl border border-gray-500/20 bg-white">
          <table className="w-full table-fixed overflow-hidden md:table-auto">
            <thead className="text-left text-sm text-gray-900">
              <tr>
                <th className="truncate px-4 py-3 font-semibold">Product</th>
                <th className="truncate px-4 py-3 font-semibold">Category</th>
                <th className="hidden truncate px-4 py-3 font-semibold md:table-cell">
                  Selling Price
                </th>
                <th className="w-[210px] truncate px-4 py-3 font-semibold">
                  In Stock
                </th>
                <th className="truncate px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {filteritem.map((product) => (
                <tr key={product.id} className="border-t border-gray-500/20">
                  <td className="flex items-center space-x-3 truncate py-3 pl-2 md:px-4 md:pl-4">
                    <div className="overflow-hidden rounded border border-gray-300">
                      <img
                        src={
                          product.images?.length > 0
                            ? `http://localhost:8080/upload/${product.images[0]}`
                            : ""
                        }
                        alt="Product"
                        className="w-16"
                      />
                    </div>
                    <span className="hidden w-full truncate sm:block">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    Rs. {product.price}
                  </td>
                  <td className="w-[210px] px-4 py-3">
                    <div className="flex min-w-[170px] items-center gap-3">
                      <label className="relative inline-flex cursor-pointer items-center text-gray-900">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={product.in_stock !== 0}
                          onChange={(e) =>
                            handleStockToggle(product.id, e.target.checked)
                          }
                        />
                        <div className="h-7 w-12 rounded-full bg-slate-300 transition-colors duration-200 peer-checked:bg-black"></div>
                        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                      <span
                        className={`inline-flex w-[92px] items-center justify-center text-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.in_stock !== 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.in_stock !== 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        className="cursor-pointer rounded border border-black px-3 py-1 text-xs text-black"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="cursor-pointer text-red-600"
                        onClick={() => deletehandel(product.id)}
                      >
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
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <button
                type="button"
                className="text-sm text-gray-500"
                onClick={() => setEditingProduct(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                className="rounded border border-gray-300 px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Product name"
              />
              <textarea
                className="rounded border border-gray-300 px-3 py-2"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description"
              />
              <select
                className="rounded border border-gray-300 px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="Mensclothing">Mensclothing</option>
                <option value="Womensclothing">Womensclothing</option>
              </select>
              <input
                className="rounded border border-gray-300 px-3 py-2"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Price"
                type="number"
              />
              <input
                className="rounded border border-gray-300 px-3 py-2"
                value={form.offerprice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, offerprice: e.target.value }))
                }
                placeholder="Offer price"
                type="number"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                className="rounded border border-gray-300 px-4 py-2"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-black px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Product;
