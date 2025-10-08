import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, BookOpen } from "lucide-react";
import Layout from "@/components/Layout";

const Support = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Support</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <Mail className="h-8 w-8 text-wallcraft-cyan mb-2" />
              <CardTitle className="text-foreground text-lg">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get help via email within 24 hours</CardDescription>
              <Button variant="wallcraft-outline" className="w-full mt-4">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-wallcraft-cyan mb-2" />
              <CardTitle className="text-foreground text-lg">Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Chat with our support team</CardDescription>
              <Button variant="wallcraft-outline" className="w-full mt-4">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-wallcraft-cyan mb-2" />
              <CardTitle className="text-foreground text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Browse our help articles</CardDescription>
              <Button variant="wallcraft-outline" className="w-full mt-4">
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-wallcraft-card border-wallcraft-card">
          <CardHeader>
            <CardTitle className="text-foreground">Contact Form</CardTitle>
            <CardDescription>Send us a message and we'll get back to you soon</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue..."
                  rows={5}
                  className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                />
              </div>
              <Button variant="wallcraft" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
};

export default Support;
