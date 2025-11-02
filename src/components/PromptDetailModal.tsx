import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Heart, Share2, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
    id: number;
    image: string;
    title: string;
    category: string;
    promptText?: string;
    description?: string;
    rating?: number;
    views: number;
    downloads: number;
    likes: number;
  };
}

const PromptDetailModal = ({ isOpen, onClose, prompt }: PromptDetailModalProps) => {
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    if (prompt.promptText) {
      await navigator.clipboard.writeText(prompt.promptText);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard"
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = prompt.image;
    link.download = `${prompt.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "Image saved"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-wallcraft-dark border-wallcraft-card p-0 max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
          >
            <X className="h-5 w-5 text-white" />
          </Button>

          {/* Header Image */}
          <div className="relative h-96">
            <img 
              src={prompt.image} 
              alt={prompt.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-wallcraft-cyan/20 text-wallcraft-cyan px-3 py-1 rounded-full text-sm font-medium">
                  {prompt.category}
                </span>
                {prompt.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{prompt.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground">{prompt.title}</h1>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>{prompt.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{prompt.downloads.toLocaleString()} downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{prompt.likes.toLocaleString()} likes</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="w-full bg-wallcraft-card">
                <TabsTrigger value="prompt" className="flex-1">Prompt</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="mt-4">
                <div className="bg-wallcraft-card rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-foreground">Prompt Text</h3>
                    <Button 
                      variant="wallcraft-ghost" 
                      size="sm"
                      onClick={handleCopyPrompt}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">
                    {prompt.promptText || "No prompt text available"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <div className="bg-wallcraft-card rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {prompt.description || "No description available"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="wallcraft" 
                size="lg" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="wallcraft-outline" 
                size="lg"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button 
                variant="wallcraft-outline" 
                size="lg"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDetailModal;
