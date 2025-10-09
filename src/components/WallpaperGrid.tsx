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
      category: "Midjourney",
      views: 1247,
      downloads: 892,
      likes: 156,
      promptText: "A fantasy character design with magical elements, vibrant colors and detailed armor",
      price: 0,
      rating: 5.0,
      rank: 1
    },
    {
      id: 2,
      image: abstractCircuit,
      title: "Elegant Allure Women",
      category: "Gemini Image",
      views: 2109,
      downloads: 1789,
      likes: 321,
      promptText: "Professional portrait photography of elegant women in modern styling",
      price: 4.99,
      rating: 5.0,
      rank: 2
    },
    {
      id: 3,
      image: neonFlowers,
      title: "Midjourney Flowers",
      category: "Midjourney",
      views: 1345,
      downloads: 987,
      likes: 189,
      promptText: "Beautiful neon flowers with glowing effects in a dark magical garden",
      price: 0,
      rating: 5.0
    },
    {
      id: 4,
      image: codingNight,
      title: "Stable Diffusion Gaming",
      category: "Stable Diffusion",
      views: 2341,
      downloads: 1567,
      likes: 234,
      promptText: "Gaming setup with neon lights, cyberpunk aesthetic, detailed digital art",
      price: 0,
      rating: 5.0
    },
    {
      id: 5,
      image: cyberWolf,
      title: "Leonardo AI Animal",
      category: "Leonardo AI",
      views: 1543,
      downloads: 1098,
      likes: 187,
      promptText: "Cyberpunk wolf with neon accents, futuristic animal portrait",
      price: 3.99,
      rating: 5.0
    },
    {
      id: 6,
      image: cyberCity,
      title: "Claude Product Design",
      category: "Claude",
      views: 1789,
      downloads: 1234,
      likes: 267,
      promptText: "Futuristic city skyline with neon lights and cyberpunk architecture",
      price: 0,
      rating: 5.0
    },
    {
      id: 7,
      image: gamingSetup,
      title: "Gemini Logo Design",
      category: "Gemini",
      views: 3456,
      downloads: 2103,
      likes: 445,
      promptText: "Modern minimalist logo design with geometric shapes and gradient colors",
      price: 6.99,
      rating: 5.0
    },
    {
      id: 8,
      image: codingNight,
      title: "GPT-4 Code Pattern",
      category: "GPT-4",
      views: 2876,
      downloads: 2134,
      likes: 456,
      promptText: "Abstract code pattern visualization with matrix style digital elements",
      price: 0,
      rating: 5.0
    },
    {
      id: 9,
      image: cyberCity,
      title: "FLUX Icon Design",
      category: "FLUX",
      views: 2234,
      downloads: 1678,
      likes: 345,
      promptText: "Set of modern UI icons with minimalist design and consistent style",
      price: 4.99,
      rating: 5.0
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {wallpapers.map((wallpaper, index) => (
          <WallpaperCard
            key={wallpaper.id}
            id={wallpaper.id}
            image={wallpaper.image}
            title={wallpaper.title}
            category={wallpaper.category}
            views={wallpaper.views}
            downloads={wallpaper.downloads}
            likes={wallpaper.likes}
            promptText={wallpaper.promptText}
            price={wallpaper.price}
            rating={wallpaper.rating}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default WallpaperGrid;