import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    generationType: "",
    model: "",
    name: "",
    description: ""
  });

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
              <p className="text-muted-foreground text-sm">1/3</p>
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
                  <Select value={formData.generationType} onValueChange={(value) => setFormData({...formData, generationType: value})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="Select Generation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
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
                  <Select value={formData.model} onValueChange={(value) => setFormData({...formData, model: value})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="Select Prompt Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midjourney">Midjourney</SelectItem>
                      <SelectItem value="dalle">DALL-E</SelectItem>
                      <SelectItem value="chatgpt">ChatGPT</SelectItem>
                      <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
