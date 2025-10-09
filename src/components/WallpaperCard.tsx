import { Heart, Download, Share2, Eye, Copy, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
}

const WallpaperCard = ({ id, image, title, category, views, downloads, likes, promptText, price = 0, rating = 0, rank }: WallpaperCardProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [promptId, setPromptId] = useState<string | null>(null);

  useEffect(() => {
    checkIfLiked();
    getOrCreatePrompt();
  }, [id]);

  const getOrCreatePrompt = async () => {
    try {
      // Check if prompt exists
      const { data: existingPrompt } = await supabase
        .from('prompts')
        .select('id')
        .eq('title', title)
        .eq('category', category)
        .single();

      if (existingPrompt) {
        setPromptId(existingPrompt.id);
      } else {
        // Create new prompt
        const { data: newPrompt } = await supabase
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
          .single();

        if (newPrompt) {
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

  return (
    <div className="group relative bg-wallcraft-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-card">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Rank badge */}
        {rank && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
            {rank}
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-wallcraft-cyan/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Badge variant="secondary" className="bg-transparent border-none p-0 text-white">
            {category}
          </Badge>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            {rating.toFixed(1)} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        
        {/* Hover/Tap Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300">
          {/* Like button */}
          <div className="absolute top-3 right-3">
            <Button 
              variant="wallcraft-ghost" 
              size="icon" 
              className={`text-white hover:text-wallcraft-cyan ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Bottom section with buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Copy Prompt Button */}
            <Button 
              variant="wallcraft" 
              size="sm" 
              className="w-full"
              onClick={handleCopyPrompt}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Prompt
            </Button>

            {/* Open Prompt Button */}
            <Button 
              variant="wallcraft-outline" 
              size="sm" 
              className="w-full"
              onClick={handleDownload}
            >
              <FileText className="h-3 w-3 mr-2" />
              Open Prompt
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2">
          {title}
        </h3>

        {price !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-wallcraft-cyan">
              {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
            </span>
            <Button 
              variant="wallcraft-ghost" 
              size="sm"
              onClick={handleCopyTemplate}
            >
              <FileText className="h-3 w-3 mr-1" />
              Template
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WallpaperCard;