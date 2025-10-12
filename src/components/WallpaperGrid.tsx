import { useState } from "react";
import WallpaperCard from "./WallpaperCard";
import gamingSetup from "@/assets/gaming-setup.jpg";
import abstractCircuit from "@/assets/abstract-circuit.jpg";
import neonFlowers from "@/assets/neon-flowers.jpg";
import codingNight from "@/assets/coding-night.jpg";
import cyberWolf from "@/assets/cyber-wolf.jpg";
import cyberCity from "@/assets/cyber-city.jpg";
import { Button } from "./ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const WallpaperGrid = () => {
  const [filterOpen, setFilterOpen] = useState(false);
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

  // Group wallpapers by category for display
  const groupedWallpapers = {
    "ASMR Prompts": wallpapers.slice(0, 4),
    "Fakemon Prompts": wallpapers.slice(4, 8),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-8">
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal size={16} />
              All Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter prompts by product, type, price, model, and category
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* Product */}
                <div>
                  <h3 className="font-semibold mb-3">Product</h3>
                  <div className="space-y-2">
                    {["Prompts", "Bundles", "Apps"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`product-${item}`} />
                        <Label htmlFor={`product-${item}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Type */}
                <div>
                  <h3 className="font-semibold mb-3">Type</h3>
                  <div className="space-y-2">
                    {["All", "Image", "Text", "Video"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`type-${item}`} />
                        <Label htmlFor={`type-${item}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Price */}
                <div>
                  <h3 className="font-semibold mb-3">Price</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="free-only" />
                    <Label htmlFor="free-only">Free prompts only</Label>
                  </div>
                </div>
                <Separator />

                {/* Model */}
                <div>
                  <h3 className="font-semibold mb-3">Model</h3>
                  <div className="space-y-2">
                    {["All", "ChatGPT Image", "Claude", "DALL·E", "DeepSeek", "FLUX", "Gemini", "Gemini Image", "GPT", "Grok", "Grok Image", "Hailuo AI", "Ideogram", "Imagen", "KLING AI", "Leonardo Ai", "Llama", "Midjourney", "Midjourney Video", "Sora", "Stable Diffusion", "Veo"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`model-${item}`} />
                        <Label htmlFor={`model-${item}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Category */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    {["All", "3D", "Abstract", "Accessory", "Ads", "Animal", "Anime", "Art", "Avatar", "Architecture", "Business", "Cartoon", "Celebrity", "Chatbot", "Clip Art", "Clothing", "Coach", "Code", "Conversion", "Copy", "Cute", "Cyberpunk", "Drawing", "Drink", "Email", "Fantasy", "Fashion", "Finance", "Fix", "Food", "Fun", "Funny", "Future", "Gaming", "Generation", "Glass", "Graphic Design", "Health", "Holiday", "Icon", "Ideas", "Illustration", "Ink", "Interior", "Jewelry", "Landscape", "Language", "Logo", "Marketing", "Mockup", "Monogram", "Monster", "Music", "Nature", "Painting", "Pattern", "People", "Photographic", "Pixel Art", "Plan", "Poster", "Product", "Prompts", "Psychedelic", "Retro", "Scary", "SEO", "Social", "Space", "Sport", "Statue", "Steampunk", "Sticker", "Study", "Unique Style", "Summarise", "Synthwave", "Texture", "Translate", "Travel", "Vehicle", "Wallpaper", "Writing"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`category-${item}`} />
                        <Label htmlFor={`category-${item}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort By</span>
          <Button variant="outline" className="gap-2">
            Popular
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      {/* Grouped Prompts Display */}
      <div className="space-y-12">
        {Object.entries(groupedWallpapers).map(([groupName, items]) => (
          <div key={groupName}>
            <h2 className="text-2xl font-bold text-foreground mb-6">{groupName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((wallpaper, index) => (
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
                  rank={index < 15 ? index + 1 : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallpaperGrid;