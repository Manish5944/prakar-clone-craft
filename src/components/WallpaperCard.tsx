import { Heart, Download, Share2, Eye } from "lucide-react";
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
}

const WallpaperCard = ({ id, image, title, category, views, downloads, likes }: WallpaperCardProps) => {
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
    <div className="group relative bg-wallcraft-card rounded-lg overflow-hidden hover:bg-wallcraft-card-hover transition-all duration-300 hover:shadow-card">
      {/* Image container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with stats */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
              <Eye className="h-3 w-3" />
              {formatNumber(views)}
            </div>
            <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
              <Download className="h-3 w-3" />
              {formatNumber(downloads)}
            </div>
            <div className="flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
              <Heart className="h-3 w-3" />
              {formatNumber(likes)}
            </div>
          </div>
          
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
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground group-hover:text-wallcraft-cyan transition-colors">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs bg-wallcraft-cyan/10 text-wallcraft-cyan border-wallcraft-cyan/20">
            {category}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(views)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatNumber(likes)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="wallcraft" 
            size="sm" 
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button 
            variant="wallcraft-outline" 
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;