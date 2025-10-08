import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";

const Settings = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        <div className="space-y-6">
          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <CardTitle className="text-foreground">Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-foreground">Email Notifications</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="text-foreground">Push Notifications</Label>
                <Switch id="push-notifications" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <CardTitle className="text-foreground">Privacy</CardTitle>
              <CardDescription>Control your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="public-profile" className="text-foreground">Public Profile</Label>
                <Switch id="public-profile" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-downloads" className="text-foreground">Show Downloads</Label>
                <Switch id="show-downloads" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-wallcraft-card border-wallcraft-card">
            <CardHeader>
              <CardTitle className="text-foreground">Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="wallcraft-outline" className="w-full">
                Change Password
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Settings;
