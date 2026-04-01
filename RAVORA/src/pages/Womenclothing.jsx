import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Pagination from "./Pagination";
import { useEffect } from "react";
import axios from "axios";

const Womenclothing = () => {
  const [item, setitem] = useState([]);

  //---------------------implement useeffect -------------------------------------
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/item/womenclothing",
        );
        setitem(res.data.item);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);
  //---------------------pagination------------------
  const itemperpage = 4;
  const [page, setpage] = useState(1);

  const start = (page - 1) * itemperpage;
  //-------------------filter womens ---------------------------
  const filterwomen = item
    .filter((value) => value.category == "Womensclothing")
    .map((value) => ({
      ...value,
      images: Array.isArray(value.images)
        ? value.images
        : JSON.parse(value.images || []),
    }));

  //---------------slice for pagination ----------------------
  const variableitem = filterwomen.slice(start, start + itemperpage);
  return (
    <>
      <div className="grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10 xl:grid-cols-4">
        {variableitem.map((value) => {
          return (
            <div key={value.id}>
              <Itemcard
                title={value.name}
                price={value.price}
                id={value.id}
                inStock={value.in_stock !== 0}
                img={
                  value.images?.length > 0
                    ? `http://localhost:8080/upload/${value.images[0]}` //pass image url
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
        total={Math.ceil(filterwomen.length / itemperpage)}
      />
    </>
  );
};
export default Womenclothing;
