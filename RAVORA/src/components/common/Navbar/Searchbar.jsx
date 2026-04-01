import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/item/home");
        setItems(res.data.item || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items
    .filter((item) =>
      item.name?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .slice(0, 6);

  const handleSelect = (id) => {
    setSearch("");
    setShowSuggestions(false);
    navigate(`/itemdetail/${id}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center rounded-xl border-2 border-gray-400 bg-white px-3 py-1 transition focus-within:border-black">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="w-full bg-transparent text-sm outline-none"
        />

        <button className="cursor-pointer" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-600"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showSuggestions && search.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={() => handleSelect(item.id)}
                className="block w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">No items found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
