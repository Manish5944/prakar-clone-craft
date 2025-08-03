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
      title: "Dark Character",
      category: "3D • Mobile Wallpaper",
      views: 1247,
      downloads: 892,
      likes: 156
    },
    {
      id: 2,
      image: abstractCircuit,
      title: "Abstract Art",
      category: "Abstract • Mobile Wallpaper",
      views: 2109,
      downloads: 1789,
      likes: 321
    },
    {
      id: 3,
      image: neonFlowers,
      title: "Beautiful Flowers",
      category: "Flowers • Mobile Wallpaper",
      views: 1345,
      downloads: 987,
      likes: 189
    },
    {
      id: 4,
      image: codingNight,
      title: "Neon Gaming",
      category: "Gaming • Mobile Wallpaper",
      views: 2341,
      downloads: 1567,
      likes: 234
    },
    {
      id: 5,
      image: cyberWolf,
      title: "Tech Laptop",
      category: "Technology • Mobile Wallpaper",
      views: 1543,
      downloads: 1098,
      likes: 187
    },
    {
      id: 6,
      image: cyberCity,
      title: "Wild Animals",
      category: "Animals • Mobile Wallpaper",
      views: 1789,
      downloads: 1234,
      likes: 267
    },
    {
      id: 7,
      image: gamingSetup,
      title: "Cyberpunk",
      category: "Abstract • Mobile Wallpaper",
      views: 3456,
      downloads: 2103,
      likes: 445
    },
    {
      id: 8,
      image: codingNight,
      title: "Coding Work",
      category: "Technology • Mobile Wallpaper",
      views: 2876,
      downloads: 2134,
      likes: 456
    },
    {
      id: 9,
      image: cyberCity,
      title: "Fantasy World",
      category: "Fantasy • Mobile Wallpaper",
      views: 2234,
      downloads: 1678,
      likes: 345
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">All Wallpapers</h1>
        <p className="text-muted-foreground text-sm">
          {wallpapers.length} wallpapers found • All images optimized for mobile • Sorted by popular
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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