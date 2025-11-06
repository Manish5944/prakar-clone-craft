import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import ImageGalleryModal from "./ImageGalleryModal";
import PromptDetailModal from "./PromptDetailModal";

interface WallpaperCardProps {
  id: number;
  image: string;
  title: string;
  category: string;
  views: number;
  downloads: number;
  likes: number;
  promptText?: string;
  price?: number;
  rating?: number;
  rank?: number;
  exampleImages?: string[];
}

const WallpaperCard = ({ id, image, title, category, views, downloads, likes, promptText, price = 0, rating = 0, rank, exampleImages = [] }: WallpaperCardProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [promptId, setPromptId] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [fullPromptData, setFullPromptData] = useState<any>(null);

  useEffect(() => {
    checkIfLiked();
    getOrCreatePrompt();
  }, [id]);

  const getOrCreatePrompt = async () => {
    try {
      // Check if prompt exists by image_url to avoid duplicates
      const { data: existingPrompt } = await supabase
        .from('prompts')
        .select('id')
        .eq('image_url', image)
        .maybeSingle();

      if (existingPrompt) {
        setPromptId(existingPrompt.id);
      } else {
        // Create new prompt only if it doesn't exist
        const { data: newPrompt, error } = await supabase
          .from('prompts')
          .insert({
            title,
            category,
            image_url: image,
            views,
            downloads,
            likes
          })
          .select('id')
          .maybeSingle();

        if (!error && newPrompt) {
          setPromptId(newPrompt.id);
        }
      }
    } catch (error) {
      console.error('Error getting/creating prompt:', error);
    }
  };

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !promptId) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .single();

    setIsLiked(!!data);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleImageClick = () => {
    setShowGalleryModal(true);
  };

  const handleOpenPrompt = async () => {
    setShowGalleryModal(false);
    
    // Fetch full prompt data if we have a promptId
    if (promptId) {
      try {
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', promptId)
          .single();
        
        if (error) throw error;
        setFullPromptData(data);
      } catch (error) {
        console.error('Error fetching prompt:', error);
      }
    }
    
    setShowDetailModal(true);
  };

  const handleDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to download prompts",
        variant: "destructive"
      });
      return;
    }

    if (!promptId) {
      toast({
        title: "Error",
        description: "Prompt not found",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save to downloads
      await supabase.from('downloads').insert({
        user_id: user.id,
        prompt_id: promptId
      });

      // Create download link
      const link = document.createElement('a');
      link.href = image;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Downloaded!",
        description: "Prompt saved to your downloads"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to save download",
        variant: "destructive"
      });
    }
  };

  const handleCopyPrompt = async () => {
    if (promptText) {
      await navigator.clipboard.writeText(promptText);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard"
      });
    } else {
      toast({
        title: "No Prompt",
        description: "No prompt text available",
        variant: "destructive"
      });
    }
  };

  const handleCopyTemplate = async () => {
    const template = `Title: ${title}\nCategory: ${category}\nPrompt: ${promptText || "N/A"}`;
    await navigator.clipboard.writeText(template);
    toast({
      title: "Template Copied!",
      description: "Template copied to clipboard"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this amazing prompt: ${title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Link copied to clipboard!"
      });
    }
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like prompts",
        variant: "destructive"
      });
      return;
    }

    if (!promptId) {
      toast({
        title: "Error",
        description: "Prompt not found",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('prompt_id', promptId);

        setIsLiked(false);
        toast({
          title: "Removed",
          description: "Removed from favorites"
        });
      } else {
        // Like
        await supabase.from('favorites').insert({
          user_id: user.id,
          prompt_id: promptId
        });

        setIsLiked(true);
        toast({
          title: "Added!",
          description: "Added to favorites"
        });
      }
    } catch (error) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive"
      });
    }
  };

  // Use actual example images from database
  const galleryImages = exampleImages.length > 0 
    ? exampleImages.map((img, index) => ({
        id: id * 10 + index,
        image: img,
        title: `${title} - Example ${index + 1}`
      }))
    : Array(3).fill(null).map((_, index) => ({
        id: id * 10 + index,
        image: image,
        title: `${title} - Variation ${index + 1}`
      }));

  return (
    <>
      <div 
        className="group relative bg-wallcraft-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-card cursor-pointer w-[250px]"
        onClick={handleImageClick}
      >
        {/* 3-Image Collage Container */}
        <div className="relative h-[140px] overflow-hidden bg-wallcraft-darker">
          <div className="grid grid-cols-3 gap-0.5 h-full">
            {/* Display first 3 example images from gallery */}
            {galleryImages.slice(0, 3).map((galleryImg, index) => (
              <div key={index} className="relative overflow-hidden">
                <img 
                  src={galleryImg.image} 
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
          
          {/* Category badge (top-left) */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs z-10">
            <span className="text-yellow-400">⚡</span>
            <span className="text-white font-semibold">{category}</span>
          </div>

          {/* Rating badge (top-right) */}
          {rating !== undefined && rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs z-10">
              <span className="text-white font-semibold">{rating.toFixed(1)}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
          )}

          {/* Rank badge (top-left corner number for top 15) */}
          {rank && rank <= 15 && (
            <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg shadow-lg z-20">
              {rank}
            </div>
          )}
          
          {/* Bottom title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
              {title}
            </h3>
          </div>
          
          {/* Hover Popup */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-20">
            <div className="text-center space-y-3">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2">{category}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="wallcraft" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Price */}
        <div className="p-2.5 bg-wallcraft-card">
          <div className="flex items-center justify-start">
            {price !== undefined && price > 0 ? (
              <span className="text-wallcraft-cyan font-bold text-sm">${price.toFixed(2)}</span>
            ) : (
              <span className="text-green-400 font-semibold text-xs px-2 py-0.5 bg-green-400/10 rounded">FREE</span>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImageGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        images={galleryImages}
        category={category}
        onOpenPrompt={handleOpenPrompt}
        promptId={promptId}
        title={title}
        price={price}
      />

      <PromptDetailModal
        prompt={fullPromptData}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </>
  );
};

export default WallpaperCard;