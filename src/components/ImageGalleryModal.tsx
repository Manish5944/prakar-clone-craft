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
      <DialogContent className="max-w-2xl bg-wallcraft-dark border-wallcraft-card p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Grid of 9 images */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {images.slice(0, 9).map((img, index) => (
            <div 
              key={img.id}
              className="rounded-lg overflow-hidden aspect-square"
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
        <div className="bg-wallcraft-card rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            {/* Thumbnail images */}
            <div className="flex gap-1">
              {images.slice(0, 3).map((img, index) => (
                <img 
                  key={index}
                  src={img.image} 
                  alt={`${title} ${index + 1}`}
                  className="w-12 h-12 object-cover rounded"
                />
              ))}
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h3 className="text-foreground font-semibold text-lg mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{category}</p>
              <div className="flex items-center justify-between">
                {price > 0 ? (
                  <span className="text-wallcraft-cyan font-bold text-xl">${price.toFixed(2)}</span>
                ) : (
                  <span className="text-green-400 font-semibold text-sm px-2 py-1 bg-green-400/10 rounded">FREE</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="wallcraft" 
          size="lg" 
          className="w-full"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryModal;
