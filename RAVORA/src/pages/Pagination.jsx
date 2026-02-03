const Pagination = ({ setpage, total, page }) => {
  let arr = [];
  for (let i = 1; i <= page + 1 && i <= total; i++) {
    arr.push(i);
  }
  return (
    <>
      <div className="flex items-center gap-3 justify-center py-8">
        <button
          className="h-10 w-10 flex items-center justify-center border rounded-md bg-white cursor-pointer"
          onClick={() => page > 1 && setpage(page - 1)}
        >
          &lt;
        </button>
        {arr.map((num) => {
          return (
            <button
              onClick={() => setpage(num)}
              className={`h-10 w-10 flex items-center justify-center border rounded-md cursor-pointer ${
                page === num
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {num}
            </button>
          );
        })}
        <span className="text-gray-500">...</span>
        <button
          onClick={() => setpage(total)}
          className={`h-10 w-10 flex items-center justify-center border rounded-md cursor-pointer ${
            page === total
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {total}
        </button>
        <button
          onClick={() => page < total && setpage(page + 1)}
          className="h-10 w-10 flex items-center justify-center border rounded-md bg-white cursor-pointer"
        >
          &gt;
        </button>
      </div>
    </>
  );
};
export default Pagination;
