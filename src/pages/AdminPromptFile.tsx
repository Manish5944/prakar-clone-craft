import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExternalLink, Upload, X, ImageIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPromptFile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const previousData = location.state || {};

  const [promptTemplate, setPromptTemplate] = useState("");
  const [price, setPrice] = useState("0");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved prompt from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminPromptFileData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.promptTemplate) setPromptTemplate(parsed.promptTemplate);
      if (parsed.price) setPrice(parsed.price);
    }
  }, []);

  // Save prompt to localStorage on change
  useEffect(() => {
    localStorage.setItem('adminPromptFileData', JSON.stringify({ promptTemplate, price }));
  }, [promptTemplate, price]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 10MB", variant: "destructive" });
      return;
    }

    setUploadedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageFile(null);
  };

  const handleFinish = async () => {
    if (!uploadedImage || !uploadedImageFile) {
      toast({ title: "Image Required", description: "Please upload an example image", variant: "destructive" });
      return;
    }
    if (!promptTemplate.trim()) {
      toast({ title: "Prompt Required", description: "Please enter the prompt text", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to upload prompts", variant: "destructive" });
        navigate('/auth');
        return;
      }

      // Upload image to storage
      const filename = `${user.id}/${Date.now()}_${uploadedImageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filename, uploadedImageFile, { contentType: uploadedImageFile.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filename);

      // Insert prompt into database
      const { error: insertError } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          title: previousData.name || "Untitled Prompt",
          category: previousData.model || previousData.generationType || "General",
          prompt_text: promptTemplate,
          description: previousData.description || "",
          image_url: publicUrl,
          example_images: [publicUrl],
          price: parseFloat(price) || 0,
          rating: 0,
          views: 0,
          downloads: 0,
          likes: 0
        });

      if (insertError) throw insertError;

      toast({ title: "Success! 🎉", description: "Prompt uploaded successfully" });

      localStorage.removeItem('adminFormData');
      localStorage.removeItem('adminPromptFileData');

      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-8 rounded-full bg-muted" />
                <div className="h-1.5 w-8 rounded-full bg-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Step 2 of 2</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4">Prompt File</h1>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Upload one example image and your prompt text. Make sure the image clearly demonstrates what the prompt generates.
                </p>
                <Button variant="outline" className="gap-2 mb-8">
                  Submission Guidelines
                  <ExternalLink className="h-4 w-4" />
                </Button>

                {/* Preview of uploaded image */}
                {uploadedImage && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Preview</p>
                    <div className="relative rounded-xl overflow-hidden border border-border" style={{ maxHeight: '350px' }}>
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ maxHeight: '350px' }}
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Form */}
              <div className="space-y-8">

                {/* Image Upload */}
                <div>
                  <Label className="text-lg font-semibold text-foreground mb-2 block">
                    Example Image
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload one image that shows what this prompt generates. Max 10MB.
                  </p>

                  {!uploadedImage ? (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <div className="p-3 rounded-full bg-muted">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">Click to upload image</p>
                          <p className="text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{uploadedImageFile?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {uploadedImageFile ? (uploadedImageFile.size / 1024 / 1024).toFixed(2) + ' MB' : ''}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleRemoveImage} className="flex-shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Prompt Template */}
                <div>
                  <Label htmlFor="promptTemplate" className="text-lg font-semibold text-foreground mb-2 block">
                    Prompt Text
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter the exact prompt. Use [square brackets] for variables.
                  </p>
                  <Textarea
                    id="promptTemplate"
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder="An Impressionist oil painting of [flower] in a purple vase, warm golden lighting, textured brushstrokes..."
                    rows={7}
                    className="bg-card border-border text-foreground font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 text-right">
                    {promptTemplate.length} characters
                  </p>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price" className="text-lg font-semibold text-foreground mb-2 block">
                    Price (USD)
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Set to 0 for a free prompt.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-7 bg-card border-border text-foreground"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                ← Back
              </Button>
              <Button
                variant="wallcraft"
                onClick={handleFinish}
                disabled={isSubmitting || !uploadedImage || !promptTemplate.trim()}
                className="px-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Publish Prompt
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPromptFile;
