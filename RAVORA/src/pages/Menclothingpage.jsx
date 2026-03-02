import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Pagination from "./Pagination";
import axios from "axios";
import { useEffect } from "react";

const Menclothing = () => {
  const [item, setitem] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/item/mensclothing",
        );
        setitem(res.data.item);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);
  const itemperpage = 4;
  const [page, setpage] = useState(1);

  const start = (page - 1) * itemperpage;
  const filtermen = item
    .filter((value) => value.category == "Mensclothing")
    .map((value) => ({
      ...value,
      images: Array.isArray(value.images)
        ? value.images
        : JSON.parse(value.images || "[]"),
    }));
  const variableitem = filtermen.slice(start, start + itemperpage);
  return (
    <>
      <div className="grid grid-cols-4 gap-18 m-10">
        {variableitem.map((value) => {
          return (
            <div key={value.id}>
              <Itemcard
                title={value.name}
                price={value.price}
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
