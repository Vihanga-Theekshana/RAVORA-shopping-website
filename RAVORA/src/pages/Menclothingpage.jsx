import { useState } from "react";
import Itemcard from "../components/Items/Itemcard";
import Pagination from "./Pagination";

const Menclothing = () => {
  const items = [
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "m2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "m3.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 1500,
      img: "m4.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "m5.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 4500,
      img: "w1.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 2500,
      img: "w2.png",
    },
    {
      title: "Premium breathable linen. Minimal clean style",
      price: 3500,
      img: "w3.png",
    },
  ];
  const itemperpage = 4;
  const [page, setpage] = useState(1);

  const start = (page - 1) * itemperpage;
  const filtermen = items.filter((value) => value.img.startsWith("m"));
  const variableitem = filtermen.slice(start, start + itemperpage);
  return (
    <>
      <div className="grid grid-cols-4 gap-18 m-10">
        {variableitem.map((value) => {
          return (
            <div>
              <Itemcard
                title={value.title}
                price={value.price}
                img={value.img}
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
