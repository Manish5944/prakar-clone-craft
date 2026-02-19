import { useState, useEffect } from "react";
import WallpaperCard from "./WallpaperCard";
import { Button } from "./ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

interface WallpaperGridProps {
  searchQuery?: string;
}

const WallpaperGrid = ({ searchQuery = "" }: WallpaperGridProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, [searchQuery]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('prompts')
        .select('id, title, category, image_url, views, downloads, likes, price, rating, example_images, prompt_text, description, created_at')
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group prompts by category for display
  const groupedPrompts: {[key: string]: any[]} = {};
  prompts.forEach(prompt => {
    const category = prompt.category || "General";
    if (!groupedPrompts[category]) {
      groupedPrompts[category] = [];
    }
    groupedPrompts[category].push(prompt);
  });

  return (
    <div className="w-full px-1 py-2">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-3 px-3">
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

      {/* Prompts Display */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? `No prompts found for "${searchQuery}"` : "No prompts available yet"}
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-[3px] space-y-0">
          {prompts.map((prompt, index) => (
            <div key={prompt.id} className="break-inside-avoid mb-[3px]">
              <WallpaperCard
                id={prompt.id}
                image={prompt.image_url}
                title={prompt.title}
                category={prompt.category}
                views={prompt.views || 0}
                downloads={prompt.downloads || 0}
                likes={prompt.likes || 0}
                promptText={prompt.prompt_text || ""}
                price={prompt.price || 0}
                rating={prompt.rating || 0}
                rank={index < 15 ? index + 1 : undefined}
                exampleImages={prompt.example_images || []}
                promptId={prompt.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WallpaperGrid;