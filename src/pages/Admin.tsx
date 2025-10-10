import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Trash2, FileText, DollarSign, Shield, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    promptText: "",
    description: "",
    imageUrl: "",
    price: "0",
    rating: "0"
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roles) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('prompts')
        .insert({
          title: formData.title,
          category: formData.category,
          prompt_text: formData.promptText,
          description: formData.description,
          image_url: formData.imageUrl,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          views: 0,
          downloads: 0,
          likes: 0
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Prompt added successfully"
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        promptText: "",
        description: "",
        imageUrl: "",
        price: "0",
        rating: "0"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Sell a Prompt</h1>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <Card className="bg-wallcraft-card border-wallcraft-card p-4">
                  <FileText className="h-8 w-8 text-wallcraft-cyan mb-2" />
                  <p className="text-sm text-muted-foreground">Provide details about your AI prompt</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-4">
                  <DollarSign className="h-8 w-8 text-wallcraft-cyan mb-2" />
                  <p className="text-sm text-muted-foreground">Sell with 0% fees via your link</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-4">
                  <Shield className="h-8 w-8 text-wallcraft-cyan mb-2" />
                  <p className="text-sm text-muted-foreground">Get paid out securely via Stripe</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-4">
                  <Rocket className="h-8 w-8 text-wallcraft-cyan mb-2" />
                  <p className="text-sm text-muted-foreground">Build an audience & grow your AI business</p>
                </Card>
              </div>
            </div>

            {/* Form Section */}
            <Card className="bg-wallcraft-card border-wallcraft-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold text-foreground">
                    Prompt Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter a catchy title for your prompt"
                    className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-lg font-semibold text-foreground">
                    AI Model Category *
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Midjourney, DALL-E, ChatGPT, Stable Diffusion"
                    className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <Label htmlFor="imageUrl" className="text-lg font-semibold text-foreground">
                    Example Image URL *
                  </Label>
                  <div className="mt-2 space-y-2">
                    <Input
                      id="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      required
                      placeholder="https://example.com/your-image.jpg"
                      className="bg-wallcraft-dark border-wallcraft-card text-foreground"
                    />
                    {formData.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full max-w-md h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt Text */}
                <div>
                  <Label htmlFor="promptText" className="text-lg font-semibold text-foreground">
                    Prompt Text *
                  </Label>
                  <Textarea
                    id="promptText"
                    value={formData.promptText}
                    onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                    required
                    rows={6}
                    placeholder="Enter your full AI prompt here... Be detailed and specific."
                    className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground font-mono"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.promptText.length} characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe what makes your prompt special, what it can be used for, tips for best results..."
                    className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground"
                  />
                </div>

                {/* Price and Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-lg font-semibold text-foreground">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="0.00"
                      className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Set to 0 for free prompts
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="rating" className="text-lg font-semibold text-foreground">
                      Initial Rating (0-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      required
                      placeholder="4.5"
                      className="mt-2 bg-wallcraft-dark border-wallcraft-card text-foreground"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="wallcraft" 
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Publish Prompt
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Card>

            {/* Guidelines */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Please ensure your prompt follows our quality guidelines. All prompts are reviewed before publication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
