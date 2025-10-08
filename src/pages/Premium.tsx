import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Layout from "@/components/Layout";

const Premium = () => {
  const features = [
    "Unlimited prompt downloads",
    "Access to exclusive prompts",
    "Priority customer support",
    "Early access to new features",
    "Remove watermarks",
    "Advanced search filters",
    "Custom collections",
    "Ad-free experience"
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upgrade to Premium</h1>
          <p className="text-muted-foreground">Unlock all features and get unlimited access</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly</CardTitle>
              <CardDescription>Perfect for short-term projects</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="wallcraft" className="w-full mb-6">
                Subscribe Monthly
              </Button>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-wallcraft-cyan flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary border-wallcraft-cyan relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-wallcraft-cyan text-white text-xs px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <CardHeader>
              <CardTitle className="text-white">Yearly</CardTitle>
              <CardDescription className="text-white/80">Save 40% with annual billing</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$5.99</span>
                <span className="text-white/80">/month</span>
                <div className="text-sm text-white/60 mt-1">Billed $71.88 yearly</div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-6 bg-white text-wallcraft-dark hover:bg-white/90">
                Subscribe Yearly
              </Button>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-white">
                    <Check className="h-4 w-4 text-white flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Premium;
