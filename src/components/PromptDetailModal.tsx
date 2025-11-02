import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Heart, Download, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt_text: string;
  image_url: string;
  example_images?: string[];
  price: number;
  rating: number;
  views: number;
  downloads: number;
  likes: number;
}

interface PromptDetailModalProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PromptDetailModal = ({ prompt, open, onOpenChange }: PromptDetailModalProps) => {
  const navigate = useNavigate();

  if (!prompt) return null;

  const handleAddToCart = () => {
    onOpenChange(false);
    navigate(`/prompt/${prompt.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-wallcraft-card border-wallcraft-card">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="mt-8">
            {/* Example Images Grid - 3x3 */}
            {prompt.example_images && prompt.example_images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {prompt.example_images.slice(0, 9).map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden aspect-square">
                      <img 
                        src={img} 
                        alt={`Example ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Card Below Images */}
            <div className="bg-gradient-to-br from-wallcraft-card to-wallcraft-dark rounded-xl p-6 border border-wallcraft-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={prompt.image_url} 
                      alt={prompt.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {prompt.title}
                      </h2>
                      <Badge variant="secondary" className="mt-1">
                        {prompt.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {prompt.rating || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {prompt.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {prompt.downloads || 0}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ${prompt.price || 0}
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDetailModal;
