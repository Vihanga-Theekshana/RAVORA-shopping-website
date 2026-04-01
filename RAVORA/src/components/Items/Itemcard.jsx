import { useNavigate } from "react-router-dom";

const Itemcard = ({ title, price, img, id, inStock = true }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex cursor-pointer flex-col gap-1 sm:gap-2"
        onClick={() => navigate(`/itemdetail/${id}`)}
      >
        <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:h-72 sm:aspect-auto lg:h-80">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            // get background image
            style={{
              backgroundImage: img
                ? `url("${img}")`
                : "linear-gradient(#e5e7eb, #d1d5db)",
            }}
          ></div>
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/55 text-sm font-semibold uppercase tracking-[0.2em] text-black backdrop-blur-[1px]">
              Out of Stock
            </div>
          )}
        </div>
        <div className="flex min-h-12 w-full flex-col gap-0.5 sm:min-h-20 sm:gap-2">
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
