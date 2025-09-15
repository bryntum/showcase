"use client";

import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/data-display/card";
import {
  BadgeCheck,
  Globe,
  CreditCard,
  Users,
  Shield,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "components/ui/actions/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/navigation/tabs";
import { Label } from "components/ui/forms/label";
import { Input } from "components/ui/forms/input";
import { Switch } from "components/ui/forms/switch";
import { Badge } from "components/ui/data-display/badge";
import { Separator } from "components/ui/layout/separator";
import dynamic from "next/dynamic";

const Settings = () => {
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="mt-4 md:mt-0">
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Manage your organization settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Website</Label>
                <Input id="company-website" defaultValue="https://acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-description">Description</Label>
                <Input
                  id="company-description"
                  defaultValue="A leading technology company."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode on and off
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Beta Features</p>
                  <p className="text-sm text-muted-foreground">
                    Get early access to new features
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </div>
                <Badge variant="default">Professional</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Professional Plan</h3>
                  </div>
                  <Badge variant="outline">$499/month</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>
                      Access to all products (Gantt, Scheduler, Calendar, Grid)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>1M API calls per month</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>10 team members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Priority support</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current billing period</span>
                    <span>Oct 10, 2023 - Nov 9, 2023</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline">Change Plan</Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">
                      Expires 12/24
                    </p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
              <Button variant="outline">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team members and roles
                  </CardDescription>
                </div>
                <Button>Invite Team Member</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "John Doe",
                    email: "john@example.com",
                    role: "Admin",
                  },
                  {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "Developer",
                  },
                  {
                    name: "Bob Johnson",
                    email: "bob@example.com",
                    role: "Viewer",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys</CardDescription>
                </div>
                <Button>Generate New Key</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Production",
                    key: "bryn_prod_xxxxxxxxxxxxxxxx",
                    created: "Aug 10, 2023",
                  },
                  {
                    name: "Development",
                    key: "bryn_dev_xxxxxxxxxxxxxxxx",
                    created: "Sep 15, 2023",
                  },
                ].map((apiKey, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{apiKey.name}</p>
                        <p className="text-xs font-mono">{apiKey.key}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Created {apiKey.created}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive mt-1"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Email Notifications",
                    description: "Receive notifications via email",
                    icon: Mail,
                  },
                  {
                    title: "Usage Alerts",
                    description: "Get alerts when approaching limits",
                    icon: Shield,
                  },
                  {
                    title: "Product Updates",
                    description: "Receive information about new features",
                    icon: Globe,
                  },
                  {
                    title: "Billing Updates",
                    description: "Get notified about billing changes",
                    icon: CreditCard,
                  },
                ].map((item, index, arr) => (
                  <Fragment key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                    {index < arr.length - 1 && <Separator />}
                  </Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Settings), {
  ssr: false
});
