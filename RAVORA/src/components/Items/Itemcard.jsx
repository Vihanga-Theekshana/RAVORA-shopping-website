const Itemcard = ({ title, price, img }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div
          className="w-full h-80  bg-cover bg-center rounded-xl"
          style={{
            backgroundImage: img
              ? `url(${img})`
              : "linear-gradient(#e5e7eb, #d1d5db)",
          }}
        ></div>
        <div className="w-full h-20 flex flex-col gap-2">
          <h1 className="font-semibold pl-1 pr-1 leading-tight">{title}</h1>
          <h3 className="pl-1 pr-1 ">Rs {price}</h3>
        </div>
      </div>
    </>
  );
};
export default Itemcard;
