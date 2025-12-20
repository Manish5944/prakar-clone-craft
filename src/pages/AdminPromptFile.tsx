import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
    resolution: "720p",
    // Video model specific fields
    version: "",
    enhancePrompt: false,
    generateAudioSync: false,
    promptOptimizer: false,
    cameraFixed: false,
    seed: "",
    hailuoVideoLink: "",
    // New fields for various models
    negativePrompt: "",
    midjourneyVideoLink: "",
    soraVideoLink: "",
    veoVideoLink: "",
    wanSeed: "",
    wanNegativePrompt: "",
    wanEnhancePrompt: false
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [imagePrompts, setImagePrompts] = useState<{[key: number]: string}>({});

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
                    {/* Video Model Specific Features */}
                    {previousData.model && (
                      <>
                        {/* Version Selector - for Veo, Hailuo, KLING, Seedance, Wan */}
                        {["veo", "hailuo-ai", "kling-ai", "seedance", "wan"].includes(previousData.model) && (
                          <div>
                            <Label htmlFor="version" className="text-lg font-semibold text-foreground mb-2 block">
                              {previousData.model === "veo" ? "Veo Version" : "Version"}
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Select the version of the model
                            </p>
                            <Select value={formData.version} onValueChange={(value) => setFormData({...formData, version: value})}>
                              <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                                <SelectValue placeholder="Select Version" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="v1">Version 1.0</SelectItem>
                                <SelectItem value="v2">Version 2.0</SelectItem>
                                <SelectItem value="v3">Version 3.0</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Duration - for Sora, Veo, KLING */}
                        {["sora", "veo", "kling-ai"].includes(previousData.model) && (
                          <div>
                            <Label htmlFor="duration" className="text-lg font-semibold text-foreground mb-2 block">
                              Duration
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Select video duration
                            </p>
                            <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                              <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                                <SelectValue placeholder="Select Duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5s">5 seconds</SelectItem>
                                <SelectItem value="10s">10 seconds</SelectItem>
                                <SelectItem value="15s">15 seconds</SelectItem>
                                <SelectItem value="30s">30 seconds</SelectItem>
                                <SelectItem value="60s">60 seconds</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Aspect Ratio - for Sora, Veo, KLING, Seedance, Wan */}
                        {["sora", "veo", "kling-ai", "seedance", "wan"].includes(previousData.model) && (
                          <div>
                            <Label htmlFor="aspectRatio" className="text-lg font-semibold text-foreground mb-2 block">
                              Aspect Ratio
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Select video aspect ratio
                            </p>
                            <Select value={formData.aspectRatio} onValueChange={(value) => setFormData({...formData, aspectRatio: value})}>
                              <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                                <SelectValue placeholder="Select Aspect Ratio" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Resolution - for Sora only */}
                        {previousData.model === "sora" && (
                          <div>
                            <Label htmlFor="resolution" className="text-lg font-semibold text-foreground mb-2 block">
                              Resolution
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Select video resolution
                            </p>
                            <Select value={formData.resolution} onValueChange={(value) => setFormData({...formData, resolution: value})}>
                              <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                                <SelectValue placeholder="Select Resolution" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="720p">720p HD</SelectItem>
                                <SelectItem value="1080p">1080p Full HD</SelectItem>
                                <SelectItem value="2k">2K</SelectItem>
                                <SelectItem value="4k">4K Ultra HD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Enhance Prompt - for Veo only */}
                        {previousData.model === "veo" && (
                          <div className="flex items-center justify-between p-4 bg-wallcraft-card rounded-lg">
                            <div>
                              <Label htmlFor="enhancePrompt" className="text-lg font-semibold text-foreground">
                                Enhance Prompt
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically enhance and optimize your prompt
                              </p>
                            </div>
                            <Switch
                              id="enhancePrompt"
                              checked={formData.enhancePrompt}
                              onCheckedChange={(checked) => setFormData({...formData, enhancePrompt: checked})}
                            />
                          </div>
                        )}

                        {/* Generate Audio Sync - for Veo only */}
                        {previousData.model === "veo" && (
                          <div className="flex items-center justify-between p-4 bg-wallcraft-card rounded-lg">
                            <div>
                              <Label htmlFor="generateAudioSync" className="text-lg font-semibold text-foreground">
                                Generate Audio Sync
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Synchronize audio with video generation
                              </p>
                            </div>
                            <Switch
                              id="generateAudioSync"
                              checked={formData.generateAudioSync}
                              onCheckedChange={(checked) => setFormData({...formData, generateAudioSync: checked})}
                            />
                          </div>
                        )}

                        {/* Prompt Optimizer - for Hailuo only */}
                        {previousData.model === "hailuo-ai" && (
                          <div className="flex items-center justify-between p-4 bg-wallcraft-card rounded-lg">
                            <div>
                              <Label htmlFor="promptOptimizer" className="text-lg font-semibold text-foreground">
                                Prompt Optimizer
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Optimize your prompt for better results
                              </p>
                            </div>
                            <Switch
                              id="promptOptimizer"
                              checked={formData.promptOptimizer}
                              onCheckedChange={(checked) => setFormData({...formData, promptOptimizer: checked})}
                            />
                          </div>
                        )}

                        {/* Camera Fixed Control - for Seedance only */}
                        {previousData.model === "seedance" && (
                          <div className="flex items-center justify-between p-4 bg-wallcraft-card rounded-lg">
                            <div>
                              <Label htmlFor="cameraFixed" className="text-lg font-semibold text-foreground">
                                Camera Fixed Control
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Keep camera position fixed during generation
                              </p>
                            </div>
                            <Switch
                              id="cameraFixed"
                              checked={formData.cameraFixed}
                              onCheckedChange={(checked) => setFormData({...formData, cameraFixed: checked})}
                            />
                          </div>
                        )}

                        {/* Seed (Optional) - for Seedance only */}
                        {previousData.model === "seedance" && (
                          <div>
                            <Label htmlFor="seed" className="text-lg font-semibold text-foreground mb-2 block">
                              Seed (Optional)
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Enter a seed value for reproducible results
                            </p>
                            <Input
                              id="seed"
                              type="number"
                              value={formData.seed}
                              onChange={(e) => setFormData({...formData, seed: e.target.value})}
                              placeholder="Enter seed number"
                              className="bg-wallcraft-card border-wallcraft-card text-foreground"
                            />
                          </div>
                        )}

                        {/* Negative Prompt - for Kling AI */}
                        {previousData.model === "kling-ai" && (
                          <div>
                            <Label htmlFor="negativePrompt" className="text-lg font-semibold text-foreground mb-2 block">
                              Negative Prompt
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Specify what you don't want in the generated video
                            </p>
                            <Textarea
                              id="negativePrompt"
                              value={formData.negativePrompt}
                              onChange={(e) => setFormData({...formData, negativePrompt: e.target.value})}
                              placeholder="blur, low quality, distorted, watermark..."
                              rows={3}
                              className="bg-wallcraft-card border-wallcraft-card text-foreground"
                            />
                          </div>
                        )}

                        {/* Wan AI - Seed, Negative Prompt, Enhance Prompt */}
                        {previousData.model === "wan" && (
                          <>
                            <div>
                              <Label htmlFor="wanSeed" className="text-lg font-semibold text-foreground mb-2 block">
                                Seed Number
                              </Label>
                              <p className="text-sm text-muted-foreground mb-2">
                                Enter a seed value for reproducible results
                              </p>
                              <Input
                                id="wanSeed"
                                type="number"
                                value={formData.wanSeed}
                                onChange={(e) => setFormData({...formData, wanSeed: e.target.value})}
                                placeholder="Enter seed number"
                                className="bg-wallcraft-card border-wallcraft-card text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="wanNegativePrompt" className="text-lg font-semibold text-foreground mb-2 block">
                                Negative Prompt
                              </Label>
                              <p className="text-sm text-muted-foreground mb-2">
                                Specify what you don't want in the generated video
                              </p>
                              <Textarea
                                id="wanNegativePrompt"
                                value={formData.wanNegativePrompt}
                                onChange={(e) => setFormData({...formData, wanNegativePrompt: e.target.value})}
                                placeholder="blur, low quality, distorted, watermark..."
                                rows={3}
                                className="bg-wallcraft-card border-wallcraft-card text-foreground"
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-wallcraft-card rounded-lg">
                              <div>
                                <Label htmlFor="wanEnhancePrompt" className="text-lg font-semibold text-foreground">
                                  Enhance Prompt
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically enhance and optimize your prompt
                                </p>
                              </div>
                              <Switch
                                id="wanEnhancePrompt"
                                checked={formData.wanEnhancePrompt}
                                onCheckedChange={(checked) => setFormData({...formData, wanEnhancePrompt: checked})}
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Example Videos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-lg font-semibold text-foreground">
                          Example videos
                        </Label>
                        <HelpCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload maximum 4 unique example videos generated by this prompt (no edits)
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
                        {uploadedVideos.length < 4 && (
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

                    {/* Example prompts */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-lg font-semibold text-foreground">
                            Example prompts
                          </Label>
                          <HelpCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Provide the exact prompts used to generate each example image.
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 italic">
                          Type the template variable values for each example into the input boxes below.
                        </p>
                        <div className="space-y-6">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="bg-wallcraft-card/30 rounded-lg p-4 border border-wallcraft-card">
                              <div className="flex gap-4">
                                <img src={image} alt={`Example ${index + 1}`} className="w-24 h-24 rounded-lg object-cover" />
                                <div className="flex-1">
                                  <Label className="text-sm font-medium text-foreground mb-2 block">
                                    Prompt for Image {index + 1}
                                  </Label>
                                  <Textarea
                                    value={imagePrompts[index] || ""}
                                    onChange={(e) => setImagePrompts({...imagePrompts, [index]: e.target.value})}
                                    placeholder={`Create a surreal minimalist composition featuring [subject or geometric shape] styled in [neon or material texture]...`}
                                    rows={4}
                                    className="bg-wallcraft-card border-wallcraft-card text-foreground font-mono text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

                {/* Hailuo Video Link - Only for Hailuo AI */}
                {isVideoGeneration && previousData.model === "hailuo-ai" && (
                  <div>
                    <Label htmlFor="hailuoVideoLink" className="text-lg font-semibold text-foreground mb-2 block">
                      Hailuo Video Share Link
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Copy and paste the Hailuo.video share link to this example you provided. We do not share this link with anyone. You can unpublish this video from Hailuo.video once your prompt has been approved.
                    </p>
                    <Input
                      id="hailuoVideoLink"
                      type="url"
                      value={formData.hailuoVideoLink}
                      onChange={(e) => setFormData({...formData, hailuoVideoLink: e.target.value})}
                      placeholder="https://hailuo.video/share/..."
                      className="bg-wallcraft-card border-wallcraft-card text-foreground"
                    />
                  </div>
                )}

                {/* Midjourney Video Link */}
                {isVideoGeneration && previousData.model === "midjourney" && (
                  <div>
                    <Label htmlFor="midjourneyVideoLink" className="text-lg font-semibold text-foreground mb-2 block">
                      Midjourney Video Share Link
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Copy and paste the Midjourney video share link to this example you provided. We do not share this link with anyone. You can unpublish this video from Midjourney once your prompt has been approved.
                    </p>
                    <Input
                      id="midjourneyVideoLink"
                      type="url"
                      value={formData.midjourneyVideoLink}
                      onChange={(e) => setFormData({...formData, midjourneyVideoLink: e.target.value})}
                      placeholder="https://midjourney.com/share/..."
                      className="bg-wallcraft-card border-wallcraft-card text-foreground"
                    />
                  </div>
                )}

                {/* Sora Video Link */}
                {isVideoGeneration && previousData.model === "sora" && (
                  <div>
                    <Label htmlFor="soraVideoLink" className="text-lg font-semibold text-foreground mb-2 block">
                      Sora Video Share Link
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Copy and paste the Sora video share link to this example you provided. We do not share this link with anyone. You can unpublish this video from Sora once your prompt has been approved.
                    </p>
                    <Input
                      id="soraVideoLink"
                      type="url"
                      value={formData.soraVideoLink}
                      onChange={(e) => setFormData({...formData, soraVideoLink: e.target.value})}
                      placeholder="https://sora.com/share/..."
                      className="bg-wallcraft-card border-wallcraft-card text-foreground"
                    />
                  </div>
                )}

                {/* Veo Video Link */}
                {isVideoGeneration && previousData.model === "veo" && (
                  <div>
                    <Label htmlFor="veoVideoLink" className="text-lg font-semibold text-foreground mb-2 block">
                      Veo Video Share Link
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Copy and paste the Veo video share link to this example you provided. We do not share this link with anyone. You can unpublish this video from Veo once your prompt has been approved.
                    </p>
                    <Input
                      id="veoVideoLink"
                      type="url"
                      value={formData.veoVideoLink}
                      onChange={(e) => setFormData({...formData, veoVideoLink: e.target.value})}
                      placeholder="https://veo.google.com/share/..."
                      className="bg-wallcraft-card border-wallcraft-card text-foreground"
                    />
                  </div>
                )}
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
