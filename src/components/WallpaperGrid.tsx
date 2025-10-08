import WallpaperCard from "./WallpaperCard";
import gamingSetup from "@/assets/gaming-setup.jpg";
import abstractCircuit from "@/assets/abstract-circuit.jpg";
import neonFlowers from "@/assets/neon-flowers.jpg";
import codingNight from "@/assets/coding-night.jpg";
import cyberWolf from "@/assets/cyber-wolf.jpg";
import cyberCity from "@/assets/cyber-city.jpg";

const WallpaperGrid = () => {
  const wallpapers = [
    {
      id: 1,
      image: gamingSetup,
      title: "ChatGPT Character Design",
      category: "ChatGPT • Character",
      views: 1247,
      downloads: 892,
      likes: 156
    },
    {
      id: 2,
      image: abstractCircuit,
      title: "DALL-E Abstract Art",
      category: "DALL-E • Abstract",
      views: 2109,
      downloads: 1789,
      likes: 321
    },
    {
      id: 3,
      image: neonFlowers,
      title: "Midjourney Flowers",
      category: "Midjourney • Nature",
      views: 1345,
      downloads: 987,
      likes: 189
    },
    {
      id: 4,
      image: codingNight,
      title: "Stable Diffusion Gaming",
      category: "Stable Diffusion • Gaming",
      views: 2341,
      downloads: 1567,
      likes: 234
    },
    {
      id: 5,
      image: cyberWolf,
      title: "Leonardo AI Animal",
      category: "Leonardo AI • Animals",
      views: 1543,
      downloads: 1098,
      likes: 187
    },
    {
      id: 6,
      image: cyberCity,
      title: "Claude Product Design",
      category: "Claude • Product Design",
      views: 1789,
      downloads: 1234,
      likes: 267
    },
    {
      id: 7,
      image: gamingSetup,
      title: "Gemini Logo Design",
      category: "Gemini • Logo",
      views: 3456,
      downloads: 2103,
      likes: 445
    },
    {
      id: 8,
      image: codingNight,
      title: "GPT-4 Code Pattern",
      category: "GPT-4 • Pattern",
      views: 2876,
      downloads: 2134,
      likes: 456
    },
    {
      id: 9,
      image: cyberCity,
      title: "FLUX Icon Design",
      category: "FLUX • Icon",
      views: 2234,
      downloads: 1678,
      likes: 345
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">All Prompts</h1>
        <p className="text-muted-foreground text-sm">
          {wallpapers.length} prompts found • Sorted by popular
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            id={wallpaper.id}
            image={wallpaper.image}
            title={wallpaper.title}
            category={wallpaper.category}
            views={wallpaper.views}
            downloads={wallpaper.downloads}
            likes={wallpaper.likes}
          />
        ))}
      </div>
    </div>
  );
};

export default WallpaperGrid;