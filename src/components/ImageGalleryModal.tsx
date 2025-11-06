import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: number;
    image: string;
    title: string;
  }>;
  category: string;
  onOpenPrompt: () => void;
  promptId: string | null;
  title: string;
  price: number;
}

const ImageGalleryModal = ({ isOpen, onClose, images, category, onOpenPrompt, promptId, title, price }: ImageGalleryModalProps) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (promptId) {
      navigate(`/prompt/${promptId}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-wallcraft-dark border-wallcraft-card p-3 scale-90">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Grid of 9 images */}
        <div className="grid grid-cols-3 gap-1 mb-3">
          {images.slice(0, 9).map((img, index) => (
            <div 
              key={img.id}
              className="rounded overflow-hidden aspect-square"
            >
              <img 
                src={img.image} 
                alt={img.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Prompt Details Section */}
        <div className="bg-wallcraft-card rounded-lg p-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Left Prompt Detail Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCart}
              className="text-xs px-2 py-1 h-auto"
            >
              Prompt Detail
            </Button>
            
            {/* Thumbnail images */}
            <div className="flex gap-1 flex-1 justify-center">
              {images.slice(0, 3).map((img, index) => (
                <img 
                  key={index}
                  src={img.image} 
                  alt={`${title} ${index + 1}`}
                  className="w-8 h-8 object-cover rounded"
                />
              ))}
            </div>
            
            {/* Right Prompt Detail Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCart}
              className="text-xs px-2 py-1 h-auto"
            >
              Prompt Detail
            </Button>
          </div>
          
          {/* Details */}
          <div className="mt-2">
            <h3 className="text-foreground font-semibold text-sm mb-0.5">{title}</h3>
            <p className="text-muted-foreground text-xs mb-1">{category}</p>
            <div className="flex items-center justify-between">
              {price > 0 ? (
                <span className="text-wallcraft-cyan font-bold text-base">${price.toFixed(2)}</span>
              ) : (
                <span className="text-green-400 font-semibold text-xs px-1.5 py-0.5 bg-green-400/10 rounded">FREE</span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="wallcraft" 
          size="sm" 
          className="w-full text-sm"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryModal;
