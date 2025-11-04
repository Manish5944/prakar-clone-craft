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
}

const ImageGalleryModal = ({ isOpen, onClose, images, category, onOpenPrompt, promptId }: ImageGalleryModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (promptId) {
      navigate(`/prompt/${promptId}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-wallcraft-dark border-wallcraft-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">{category}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main selected image */}
        <div className="mb-6">
          <img 
            src={images[selectedImage]?.image} 
            alt={images[selectedImage]?.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Grid of 9 images */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {images.slice(0, 9).map((img, index) => (
            <div 
              key={img.id}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index ? 'border-wallcraft-cyan' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={img.image} 
                alt={img.title}
                className="w-full h-24 object-cover hover:scale-110 transition-transform"
              />
            </div>
          ))}
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
