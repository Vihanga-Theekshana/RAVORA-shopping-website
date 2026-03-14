const Promovideo = () => {
  return (
    <div className="relative h-[38vh] min-h-[240px] w-full overflow-hidden sm:h-[48vh] md:h-[60vh] lg:h-[100svh] lg:min-h-[100svh]">
      <video
        className="h-full w-full object-cover object-center"
        src="/videos/promo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
};
export default Promovideo;
