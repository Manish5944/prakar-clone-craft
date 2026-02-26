import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="w-full px-3 py-2">
      <div className="w-full overflow-hidden rounded-2xl">
        <img
          src={heroBanner}
          alt="Prompt Copy Marketplace"
          className="w-full h-auto block object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
