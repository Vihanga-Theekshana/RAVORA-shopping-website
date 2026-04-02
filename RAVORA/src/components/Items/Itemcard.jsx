import { useNavigate } from "react-router-dom";

const Itemcard = ({ title, price, img, id, inStock = true }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="flex h-full cursor-pointer flex-col"
        onClick={() => navigate(`/itemdetail/${id}`)}
      >
        <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[1.4rem] sm:h-72 sm:aspect-auto lg:h-80">
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
        <div className="flex flex-1 flex-col px-0.5 pt-2.5">
          <h1 className="line-clamp-2 h-[2.75rem] pt-1 text-[0.85rem] font-semibold leading-[1.1] tracking-tight text-black sm:h-[2.95rem] sm:text-[0.92rem]">
            {title}
          </h1>
          <div className="mt-0 min-h-[1.4rem]">
            <h3 className="text-[0.85rem] font-medium leading-none text-black sm:text-[0.92rem]">
              Rs {price}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};
export default Itemcard;
