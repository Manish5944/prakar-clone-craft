import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Trash2, HelpCircle, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPromptFile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const previousData = location.state || {};

  const [formData, setFormData] = useState({
    promptTemplate: "",
    chatgptVersion: "",
    generationType: "",
    promptInstructions: "",
    referenceImage: "no",
    soraVersion: "2.0",
    duration: "10s",
    aspectRatio: "9:16",
    resolution: "720p"
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminPromptFileData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData.formData || formData);
      // Don't persist images/videos in localStorage due to size limits
    }
  }, []);

  // Save to localStorage whenever form data changes (not images/videos)
  useEffect(() => {
    try {
      localStorage.setItem('adminPromptFileData', JSON.stringify({
        formData
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [formData]);

  const handleFinish = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload prompts",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Upload images to storage
      const imageUrls: string[] = [];
      const imagesToUpload = isVideoGeneration ? uploadedVideos : uploadedImages;

      for (let i = 0; i < imagesToUpload.length; i++) {
        const base64Data = imagesToUpload[i];
        
        // Convert base64 to blob
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        // Generate unique filename
        const filename = `${user.id}/${Date.now()}_${i}.${blob.type.split('/')[1]}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('prompt-images')
          .upload(filename, blob);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('prompt-images')
          .getPublicUrl(filename);

        imageUrls.push(publicUrl);
      }

      if (imageUrls.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one example image",
          variant: "destructive"
        });
        return;
      }

      // Insert prompt into database
      const { error } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          title: previousData.name || "Untitled Prompt",
          category: previousData.model || "General",
          prompt_text: formData.promptTemplate,
          description: previousData.description || formData.promptInstructions,
          image_url: imageUrls[0],
          example_images: imageUrls,
          price: 0,
          rating: 0,
          views: 0,
          downloads: 0,
          likes: 0
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Prompt uploaded successfully"
      });

      // Clear localStorage after successful submission
      localStorage.removeItem('adminFormData');
      localStorage.removeItem('adminPromptFileData');

      // Navigate to home page
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newVideos.push(reader.result as string);
          if (newVideos.length === files.length) {
            setUploadedVideos([...uploadedVideos, ...newVideos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(uploadedVideos.filter((_, i) => i !== index));
  };

  const isVideoGeneration = previousData.generationType === "video";

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <p className="text-muted-foreground text-sm">2/2</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4">Prompt File</h1>
                <p className="text-muted-foreground mb-6">
                  Upload your prompt, plus examples and instructions on how to use it. Ensure you have read our prompt submission guidelines to understand what prompts are accepted.
                </p>
                <Button variant="outline" className="gap-2">
                  Prompt Submission Guidelines
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-6">
                {/* Prompt Template */}
                <div>
                  <Label htmlFor="promptTemplate" className="text-lg font-semibold text-foreground mb-2 block">
                    Prompt template
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Put any variables in [square brackets].
                  </p>
                  <Textarea
                    id="promptTemplate"
                    value={formData.promptTemplate}
                    onChange={(e) => setFormData({...formData, promptTemplate: e.target.value})}
                    placeholder="An Impressionist oil painting of [Flower] in a purple vase.."
                    rows={6}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground font-mono"
                  />
                </div>

                {/* Conditional rendering based on generation type */}
                {isVideoGeneration ? (
                  <>
                    {/* Sora Version */}
                    <div>
                      <Label htmlFor="soraVersion" className="text-lg font-semibold text-foreground mb-2 block">
                        Sora version
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        What version of Sora does this prompt use?
                      </p>
                      <Select value={formData.soraVersion} onValueChange={(value) => setFormData({...formData, soraVersion: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="2.0" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2.0">2.0</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="1.0">1.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generation Type for Videos */}
                    <div>
                      <Label htmlFor="genType" className="text-lg font-semibold text-foreground mb-2 block">
                        Generation type
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Is this a text-to-video or image-to-video prompt?
                      </p>
                      <Select value={formData.generationType} onValueChange={(value) => setFormData({...formData, generationType: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="Text to video" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-to-video">Text to video</SelectItem>
                          <SelectItem value="image-to-video">Image to video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Example Videos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-lg font-semibold text-foreground">
                          Example videos
                        </Label>
                        <HelpCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload 4 unique example videos generated by this prompt (no edits)
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {uploadedVideos.map((video, index) => (
                          <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-wallcraft-card">
                            <video src={video} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeVideo(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {uploadedVideos.length < 9 && (
                          <label className="w-32 h-32 rounded-lg border-2 border-dashed border-wallcraft-card bg-wallcraft-card/30 hover:bg-wallcraft-card/50 transition-colors flex items-center justify-center cursor-pointer">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                            <input
                              type="file"
                              accept="video/*"
                              multiple
                              className="hidden"
                              onChange={handleVideoUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Label htmlFor="duration" className="text-lg font-semibold text-foreground mb-2 block">
                        Duration
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select the duration of the videos generated by this prompt.
                      </p>
                      <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="10s" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5s">5s</SelectItem>
                          <SelectItem value="10s">10s</SelectItem>
                          <SelectItem value="15s">15s</SelectItem>
                          <SelectItem value="20s">20s</SelectItem>
                          <SelectItem value="30s">30s</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <Label htmlFor="aspectRatio" className="text-lg font-semibold text-foreground mb-2 block">
                        Aspect ratio
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select the aspect ratio of the videos generated by this prompt.
                      </p>
                      <Select value={formData.aspectRatio} onValueChange={(value) => setFormData({...formData, aspectRatio: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="9:16" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9</SelectItem>
                          <SelectItem value="9:16">9:16</SelectItem>
                          <SelectItem value="1:1">1:1</SelectItem>
                          <SelectItem value="4:3">4:3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resolution */}
                    <div>
                      <Label htmlFor="resolution" className="text-lg font-semibold text-foreground mb-2 block">
                        Resolution
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select the resolution of the videos generated by this prompt.
                      </p>
                      <Select value={formData.resolution} onValueChange={(value) => setFormData({...formData, resolution: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="720p" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="720p">720p</SelectItem>
                          <SelectItem value="1080p">1080p</SelectItem>
                          <SelectItem value="4k">4K</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* ChatGPT Image Version - for non-video */}

                    <div>
                      <Label htmlFor="chatgptVersion" className="text-lg font-semibold text-foreground mb-2 block">
                        ChatGPT Image version
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        What version of ChatGPT Image does this prompt use?
                      </p>
                      <Select value={formData.chatgptVersion} onValueChange={(value) => setFormData({...formData, chatgptVersion: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="GPT-5 Image" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt5-image">GPT-5 Image</SelectItem>
                          <SelectItem value="gpt4-image">GPT-4 Image</SelectItem>
                          <SelectItem value="dalle3">DALL-E 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generation Type */}
                    <div>
                      <Label htmlFor="genType" className="text-lg font-semibold text-foreground mb-2 block">
                        Generation type
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Is this a text-to-image or image-to-image prompt?
                      </p>
                      <Select value={formData.generationType} onValueChange={(value) => setFormData({...formData, generationType: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="Text to image" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-to-image">Text to image</SelectItem>
                          <SelectItem value="image-to-image">Image to image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Example Images */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-lg font-semibold text-foreground">
                          Example images
                        </Label>
                        <HelpCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload 9 unique example images generated by this prompt (no collages or edits)
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-wallcraft-card">
                            <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {uploadedImages.length < 9 && (
                          <label className="w-32 h-32 rounded-lg border-2 border-dashed border-wallcraft-card bg-wallcraft-card/30 hover:bg-wallcraft-card/50 transition-colors flex items-center justify-center cursor-pointer">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Reference Image */}
                    <div>
                      <Label htmlFor="referenceImage" className="text-lg font-semibold text-foreground mb-2 block">
                        Reference image
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Does this prompt use a reference image for all generations?
                      </p>
                      <Select value={formData.referenceImage} onValueChange={(value) => setFormData({...formData, referenceImage: value})}>
                        <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                          <SelectValue placeholder="No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Prompt Instructions */}
                <div>
                  <Label htmlFor="promptInstructions" className="text-lg font-semibold text-foreground mb-2 block">
                    Prompt instructions
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Any extra tips or examples for the buyer on how to use this prompt.
                  </p>
                  <Textarea
                    id="promptInstructions"
                    value={formData.promptInstructions}
                    onChange={(e) => setFormData({...formData, promptInstructions: e.target.value})}
                    placeholder="To get the most out of this prompt you need to.."
                    rows={6}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-wallcraft-card">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin')}
                >
                  Back
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="wallcraft"
                onClick={handleFinish}
              >
                Next: Finish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPromptFile;
