import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">Admin Panel</h1>
          
          <div className="bg-wallcraft-card rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Add New Prompt</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-wallcraft-dark border-wallcraft-card"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder="e.g., Midjourney, DALL-E, ChatGPT"
                  className="bg-wallcraft-dark border-wallcraft-card"
                />
              </div>

              <div>
                <Label htmlFor="promptText">Prompt Text</Label>
                <Textarea
                  id="promptText"
                  value={formData.promptText}
                  onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                  required
                  rows={4}
                  placeholder="Enter the AI prompt text here..."
                  className="bg-wallcraft-dark border-wallcraft-card"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Optional description..."
                  className="bg-wallcraft-dark border-wallcraft-card"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="bg-wallcraft-dark border-wallcraft-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="bg-wallcraft-dark border-wallcraft-card"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                    className="bg-wallcraft-dark border-wallcraft-card"
                  />
                </div>
              </div>

              <Button type="submit" variant="wallcraft" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
