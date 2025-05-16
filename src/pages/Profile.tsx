
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Profile = ({ onLogout }: { onLogout: () => void }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    updates: false,
    marketing: false,
  });

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-[600px] grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="firm">Firm</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Architect" defaultValue="Architect" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@architectfirm.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="(808) 555-1234" defaultValue="(808) 555-1234" />
                  </div>

                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Update your professional details and license information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" placeholder="HAR-12345" defaultValue="HAR-12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiration">License Expiration</Label>
                      <Input 
                        id="licenseExpiration" 
                        type="date"
                        defaultValue="2026-12-31"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" placeholder="Principal Architect" defaultValue="Principal Architect" />
                  </div>
                  
                  <Button type="submit">Update Professional Info</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="firm" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Firm Information</CardTitle>
                <CardDescription>
                  Update your firm details and branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firmName">Firm Name</Label>
                    <Input id="firmName" placeholder="Architecture Firm" defaultValue="Hawaii Design Partners" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firmAddress">Firm Address</Label>
                    <Input id="firmAddress" placeholder="123 Main St" defaultValue="1234 Waikiki Ave, Honolulu, HI 96815" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firmWebsite">Website</Label>
                    <Input id="firmWebsite" placeholder="https://example.com" defaultValue="https://hawaiidesignpartners.com" />
                  </div>
                  
                  <Button type="submit">Update Firm Information</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding & Customization</CardTitle>
                <CardDescription>
                  Customize how your firm appears on generated documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Logo and document customization options will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about your account and projects
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, email: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="update-notifications">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new features and improvements
                      </p>
                    </div>
                    <Switch 
                      id="update-notifications" 
                      checked={notifications.updates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, updates: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing communications and special offers
                      </p>
                    </div>
                    <Switch 
                      id="marketing-notifications" 
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, marketing: checked})
                      }
                    />
                  </div>
                </div>
                
                <Button variant="outline" className="mt-4">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the Professional plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">Professional Plan</h3>
                        <p className="text-muted-foreground">$49/month, billed monthly</p>
                      </div>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">Current Plan</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">✓</div>
                        <span>Unlimited projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">✓</div>
                        <span>Professional PDF exports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">✓</div>
                        <span>All zoning districts</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive">Cancel Subscription</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your recent invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Billing history will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
