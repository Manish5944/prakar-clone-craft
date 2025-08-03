import { Heart, Download, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WallpaperCardProps {
  image: string;
  title: string;
  category: string;
  views: number;
  downloads: number;
  likes: number;
}

const WallpaperCard = ({ image, title, category, views, downloads, likes }: WallpaperCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
            <Button variant="wallcraft-ghost" size="icon" className="text-white hover:text-wallcraft-cyan">
              <Heart className="h-4 w-4" />
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
          <Button variant="wallcraft" size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button variant="wallcraft-outline" size="sm">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;