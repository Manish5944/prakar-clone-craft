import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Heart, Eye, Star } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt_text: string;
  image_url: string;
  example_images: string[];
  price: number;
  rating: number;
  views: number;
  downloads: number;
  likes: number;
}

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPrompt(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-wallcraft-dark flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!prompt) {
    return (
      <Layout>
        <div className="min-h-screen bg-wallcraft-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Prompt not found</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={prompt.image_url} 
                    alt={prompt.title}
                    className="w-full h-auto"
                  />
                </div>

                {/* Example Images Grid */}
                {prompt.example_images && prompt.example_images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {prompt.example_images.map((img, index) => (
                      <div key={index} className="rounded-lg overflow-hidden aspect-square">
                        <img 
                          src={img} 
                          alt={`Example ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div>
                <div className="mb-4">
                  <Badge variant="secondary" className="mb-2">
                    {prompt.category}
                  </Badge>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {prompt.title}
                  </h1>
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
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {prompt.likes || 0}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">
                    ${prompt.price || 0}
                  </p>
                </div>

                {/* Description */}
                {prompt.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Description
                    </h2>
                    <p className="text-muted-foreground">
                      {prompt.description}
                    </p>
                  </div>
                )}

                {/* Prompt Template */}
                {prompt.prompt_text && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Prompt Template
                    </h2>
                    <div className="bg-wallcraft-card p-4 rounded-lg">
                      <code className="text-sm text-foreground font-mono">
                        {prompt.prompt_text}
                      </code>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1">
                    Download Prompt
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromptDetail;
