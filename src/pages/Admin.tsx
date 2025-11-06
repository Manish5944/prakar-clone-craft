import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    generationType: "",
    model: "",
    name: "",
    description: "",
    // Video model specific fields
    version: "",
    duration: "",
    aspectRatio: "",
    resolution: "",
    enhancePrompt: false,
    generateAudioSync: false,
    promptOptimizer: false,
    cameraFixed: false,
    seed: ""
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminFormData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('adminFormData', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    navigate('/admin/prompt-file', { state: formData });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <p className="text-muted-foreground text-sm">1/2</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4">Prompt Details</h1>
                <p className="text-muted-foreground mb-4">
                  Tell us some basic details about the prompt you want to sell.
                </p>
                <p className="text-muted-foreground mb-6">
                  Don't know what to sell? Explore what's trending to get ideas.
                </p>
                <Button variant="outline" className="gap-2">
                  Explore Trends
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-6">
                {/* Generation Type */}
                <div>
                  <Label htmlFor="generationType" className="text-lg font-semibold text-foreground mb-2 block">
                    Generation Type
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    What kind of content does your prompt generate?
                  </p>
                  <Select value={formData.generationType} onValueChange={(value) => setFormData({...formData, generationType: value, model: ""})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="Select Generation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div>
                  <Label htmlFor="model" className="text-lg font-semibold text-foreground mb-2 block">
                    Model
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select the AI model your prompt uses
                  </p>
                  <Select value={formData.model} onValueChange={(value) => setFormData({
                    ...formData, 
                    model: value,
                    // Reset video-specific fields when model changes
                    version: "",
                    duration: "",
                    aspectRatio: "",
                    resolution: "",
                    enhancePrompt: false,
                    generateAudioSync: false,
                    promptOptimizer: false,
                    cameraFixed: false,
                    seed: ""
                  })}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.generationType === "image" && (
                        <>
                          <SelectItem value="chatgpt-image">ChatGPT Image</SelectItem>
                          <SelectItem value="flux">FLUX</SelectItem>
                          <SelectItem value="gemini-image">Gemini Image</SelectItem>
                          <SelectItem value="grok-image">Grok Image</SelectItem>
                          <SelectItem value="hunyuan">Hunyuan</SelectItem>
                          <SelectItem value="ideogram">Ideogram</SelectItem>
                          <SelectItem value="imagen">Imagen</SelectItem>
                          <SelectItem value="leonardo-ai">Leonardo AI</SelectItem>
                          <SelectItem value="midjourney">Midjourney</SelectItem>
                          <SelectItem value="qwen-image">Qwen Image</SelectItem>
                          <SelectItem value="recraft">Recraft</SelectItem>
                          <SelectItem value="seedream">Seedream</SelectItem>
                          <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                        </>
                      )}
                      {formData.generationType === "video" && (
                        <>
                          <SelectItem value="hailuo-ai">Hailuo AI</SelectItem>
                          <SelectItem value="kling-ai">KLING AI</SelectItem>
                          <SelectItem value="midjourney-video">Midjourney Video</SelectItem>
                          <SelectItem value="seedance">Seedance</SelectItem>
                          <SelectItem value="sora">Sora</SelectItem>
                          <SelectItem value="veo">Veo</SelectItem>
                          <SelectItem value="wan">Wan</SelectItem>
                        </>
                      )}
                      {formData.generationType === "text" && (
                        <>
                          <SelectItem value="claude">Claude</SelectItem>
                          <SelectItem value="deepseek">DeepSeek</SelectItem>
                          <SelectItem value="gemini">Gemini</SelectItem>
                          <SelectItem value="chatgpt">ChatGPT</SelectItem>
                          <SelectItem value="grok">Grok</SelectItem>
                          <SelectItem value="llama">Llama</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {!formData.generationType && (
                    <p className="text-xs text-muted-foreground mt-1">Please select generation type first</p>
                  )}
                </div>

                {/* Video Model Specific Features */}
                {formData.generationType === "video" && formData.model && (
                  <>
                    {/* Version Selector - for Veo, Hailuo, KLING, Seedance, Wan */}
                    {["veo", "hailuo-ai", "kling-ai", "seedance", "wan"].includes(formData.model) && (
                      <div>
                        <Label htmlFor="version" className="text-lg font-semibold text-foreground mb-2 block">
                          {formData.model === "veo" ? "Veo Version" : "Version"}
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
                    {["sora", "veo", "kling-ai"].includes(formData.model) && (
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
                    {["sora", "veo", "kling-ai", "seedance", "wan"].includes(formData.model) && (
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
                    {formData.model === "sora" && (
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
                    {formData.model === "veo" && (
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
                    {formData.model === "veo" && (
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
                    {formData.model === "hailuo-ai" && (
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
                    {formData.model === "seedance" && (
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
                    {formData.model === "seedance" && (
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
                  </>
                )}

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-foreground mb-2 block">
                    Name
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Suggest a title for this prompt.
                  </p>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Vibrant Startup Logos"
                    maxLength={48}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground"
                  />
                  <p className="text-sm text-muted-foreground mt-1 text-right">
                    {formData.name.length} characters left
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-foreground mb-2 block">
                    Description
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Describe what your prompt does to a potential buyer. A more detailed description will increase your sales.
                  </p>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Generates logos with a colorful aesthetic..."
                    rows={4}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-wallcraft-card">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <Button 
                variant="wallcraft"
                onClick={handleNext}
              >
                Next: Prompt File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
