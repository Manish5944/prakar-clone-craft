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
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - 9 Images Grid (2 columns) */}
              <div className="lg:col-span-2">
                {/* Main Title Section */}
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-3">
                    {prompt.category}
                  </Badge>
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {prompt.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{prompt.rating || 0}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {prompt.views || 0} views
                    </span>
                    <span className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {prompt.downloads || 0} downloads
                    </span>
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      {prompt.likes || 0} likes
                    </span>
                  </div>
                </div>

                {/* High Quality Image Versions Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    High quality image versions
                  </h2>
                  {prompt.example_images && prompt.example_images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {prompt.example_images.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden aspect-square bg-wallcraft-card hover:scale-105 transition-transform cursor-pointer">
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

                {/* Prompt Template Section */}
                {prompt.prompt_text && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Prompt template
                    </h2>
                    <div className="bg-wallcraft-card border border-wallcraft-card rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <p className="text-sm text-muted-foreground font-medium">Copy prompt</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.prompt_text);
                            toast({
                              title: "Copied!",
                              description: "Prompt template copied to clipboard"
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="bg-wallcraft-dark/50 p-4 rounded border border-wallcraft-card">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                          {prompt.prompt_text}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Example Prompts Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Example prompts
                  </h2>
                  <div className="space-y-4">
                    {prompt.example_images && prompt.example_images.slice(0, 9).map((img, index) => (
                      <div key={index} className="bg-wallcraft-card border border-wallcraft-card rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={img} 
                              alt={`Example ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">
                              {prompt.prompt_text?.replace(/\[.*?\]/g, (match) => {
                                const examples = [
                                  "Red Bull can", "Coca-Cola glass bottle", "Sprite plastic bottle",
                                  "Fanta orange bottle", "Pepsi aluminum can", "Heineken beer bottle",
                                  "San Pellegrino glass bottle", "Evian glass bottle", "Perrier bottle"
                                ];
                                return examples[index] || match;
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prompt Instructions Section */}
                {prompt.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Prompt instructions
                    </h2>
                    <div className="bg-wallcraft-card border border-wallcraft-card rounded-lg p-6">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          {prompt.description}
                        </p>
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Replace each variable in square brackets with your own:</span>
                          </p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li><code className="text-wallcraft-cyan">[main bottled beverage or product]</code> — e.g., "Red Bull can", "Perrier glass bottle"</li>
                            <li><code className="text-wallcraft-cyan">[splashing elements or garnish]</code> — e.g., "lime slices and ice cubes", "tea leaves and peaches"</li>
                            <li><code className="text-wallcraft-cyan">[floating accent ingredient or object]</code> — e.g., "mint leaves", "lightning arcs"</li>
                            <li><code className="text-wallcraft-cyan">[background color or gradient]</code> — e.g., "teal-blue gradient", "deep neon purple"</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Price Card */}
                  <div className="bg-wallcraft-card border border-wallcraft-card rounded-lg p-6 mb-4">
                    <div className="text-center mb-6">
                      <p className="text-5xl font-bold text-primary mb-2">
                        ${prompt.price || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">One-time purchase</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button size="lg" className="w-full text-lg py-6">
                        <Download className="h-5 w-5 mr-2" />
                        Download Prompt
                      </Button>
                      <Button size="lg" variant="outline" className="w-full">
                        <Heart className="h-5 w-5 mr-2" />
                        Add to Favorites
                      </Button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-wallcraft-card border border-wallcraft-card rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">What's included</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Full prompt template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>9 example variations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>High-quality images</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Detailed instructions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Commercial usage rights</span>
                      </li>
                    </ul>
                  </div>
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
