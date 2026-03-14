import { useNavigate } from "react-router-dom";

const Itemcard = ({ title, price, img, id }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex cursor-pointer flex-col gap-2"
        onClick={() => navigate(`/itemdetail/${id}`)}
      >
        <div
          className="aspect-[3/4] w-full rounded-xl bg-cover bg-center sm:h-72 sm:aspect-auto lg:h-80"
          // get background image
          style={{
            backgroundImage: img
              ? `url(${img})`
              : "linear-gradient(#e5e7eb, #d1d5db)",
          }}
        ></div>
        <div className="flex min-h-20 w-full flex-col gap-1 sm:gap-2">
          <h1 className="line-clamp-2 px-1 text-sm font-semibold leading-tight sm:text-base">
            {title}
          </h1>
          <h3 className="px-1 text-sm sm:text-base">Rs {price}</h3>
        </div>
      </div>
    </>
  );
};
export default Itemcard;
