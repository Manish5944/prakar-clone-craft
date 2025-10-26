import { Button } from "./ui/button";

const MarketplaceExplore = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-wallcraft-dark via-wallcraft-primary/20 to-wallcraft-dark rounded-lg my-12">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Explore the Marketplace
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Discover thousands of quality, tested AI prompts made by expert prompt engineers
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold px-8"
          >
            Explore Marketplace
          </Button>
        </div>
      </div>
      
      {/* Background blur effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 bg-gradient-to-l from-wallcraft-primary/30 to-transparent blur-3xl" />
    </div>
  );
};

export default MarketplaceExplore;
