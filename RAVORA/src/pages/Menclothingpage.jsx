import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Pagination from "./Pagination";
import axios from "axios";
import { useEffect } from "react";

const Menclothing = () => {
  //-------------set use state to store all items ------------
  const [item, setitem] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/item/mensclothing", //request get
        );
        setitem(res.data.item);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);

  // ----------pagination-----------
  const itemperpage = 4;
  const [page, setpage] = useState(1);

  const start = (page - 1) * itemperpage;

  // filter item each category and convert images string to object
  const filtermen = item
    .filter((value) => value.category == "Mensclothing")
    .map((value) => ({
      ...value,
      images: Array.isArray(value.images)
        ? value.images
        : JSON.parse(value.images || "[]"),
    }));
  //slice items show each page
  const variableitem = filtermen.slice(start, start + itemperpage);
  return (
    <>
      <div className="grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10 xl:grid-cols-4">
        {variableitem.map((value) => {
          return (
            <div key={value.id}>
              {/* pass props value to item card */}
              <Itemcard
                title={value.name}
                price={value.price}
                id={value.id}
                img={
                  value.images?.length > 0
                    ? `http://localhost:8080/upload/${value.images[0]}`
                    : ""
                }
              />
            </div>
          );
        })}
      </div>
      {/* pagination */}
      <Pagination
        page={page}
        setpage={setpage}
        total={Math.ceil(filtermen.length / itemperpage)}
      />
    </>
  );
};
export default Menclothing;
