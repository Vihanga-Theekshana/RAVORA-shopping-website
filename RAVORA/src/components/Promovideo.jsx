const Promovideo = () => {
  return (
    <div className="w-full">
      <video
        className="w-full h-140 object-cover"
        src="/videos/promo.mp4"
        autoPlay
        muted
        loop
        preload="metadata"
      />
    </div>
  );
};
export default Promovideo;
