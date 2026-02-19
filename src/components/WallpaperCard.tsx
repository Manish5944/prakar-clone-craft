import { Heart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  promptId?: string;
}

const WallpaperCard = ({ id, image, title, category, views, downloads, likes, promptText, price = 0, rating = 0, rank, exampleImages = [], promptId: externalPromptId }: WallpaperCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [promptId, setPromptId] = useState<string | null>(externalPromptId || null);

  useEffect(() => {
    if (!externalPromptId) {
      getOrCreatePrompt();
    }
    checkIfLiked();
  }, [id, externalPromptId]);

  const getOrCreatePrompt = async () => {
    try {
      const { data: existingPrompt } = await supabase
        .from('prompts')
        .select('id')
        .eq('image_url', image)
        .maybeSingle();

      if (existingPrompt) {
        setPromptId(existingPrompt.id);
      } else {
        const { data: newPrompt, error } = await supabase
          .from('prompts')
          .insert({ title, category, image_url: image, views, downloads, likes })
          .select('id')
          .maybeSingle();

        if (!error && newPrompt) setPromptId(newPrompt.id);
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

  const handleCardClick = () => {
    const targetId = promptId || externalPromptId;
    if (targetId) {
      navigate(`/prompt/${targetId}`);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Login Required", description: "Please login to like prompts", variant: "destructive" });
      return;
    }
    if (!promptId) return;

    try {
      if (isLiked) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('prompt_id', promptId);
        setIsLiked(false);
        toast({ title: "Removed", description: "Removed from favorites" });
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, prompt_id: promptId });
        setIsLiked(true);
        toast({ title: "Added!", description: "Added to favorites" });
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return (
    <div
      className="group relative overflow-hidden cursor-pointer w-full"
      onClick={handleCardClick}
    >
      {/* Image at natural aspect ratio — no forced crop, no fixed height */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Rank badge — always visible */}
        {rank && rank <= 15 && (
          <div className="absolute top-0 left-0 bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded-br-lg shadow-lg z-20">
            #{rank}
          </div>
        )}

        {/* Like button — appears on hover */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/60 backdrop-blur-sm p-1.5 rounded-full z-10"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
        </button>

        {/* Bottom overlay — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <p className="text-muted-foreground text-xs font-medium">{category}</p>
          <h3 className="text-foreground font-semibold text-sm line-clamp-2 mt-0.5 leading-tight">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            {price > 0 ? (
              <span className="text-primary font-bold text-xs">${price.toFixed(2)}</span>
            ) : (
              <span className="text-accent font-semibold text-xs px-1.5 py-0.5 bg-accent/10 rounded-full">FREE</span>
            )}
            {rating > 0 && (
              <span className="flex items-center gap-0.5 text-muted-foreground text-xs">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;
