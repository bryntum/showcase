"use client";

import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/data-display/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCreditCard,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import { faUsers, faShield, faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/navigation/tabs";
import { Badge } from "components/ui/data-display/badge";
import { Separator } from "components/ui/layout/separator";
import {
  BryntumSlideToggle,
  BryntumTextField,
  BryntumButton,
} from "@bryntum/core-react-thin";
import { Toast } from "@bryntum/core-thin";

const Settings = () => {
  const handleSaveSettings = () => {
    Toast.show({
      html: "Settings saved successfully",
      timeout: 5000,
    });
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
              <div className="space-y-4">
                <BryntumTextField
                  id="company-name"
                  label="Company Name"
                  cls="text-input !w-full"
                  labelPosition="above"
                  value="Acme Inc."
                />
                <BryntumTextField
                  id="company-website"
                  label="Website"
                  cls="text-input !w-full"
                  labelPosition="above"
                  value="https://acme.com"
                />
                <BryntumTextField
                  id="company-description"
                  label="Description"
                  cls="text-input !w-full"
                  labelPosition="above"
                  value="A leading technology company."
                />
              </div>
              <BryntumButton
                cls="fa fa-save gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                onClick={handleSaveSettings}
                text="Save Changes"
              />
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
                  <p className="text-sm font-medium">Beta Features</p>
                  <p className="text-sm text-muted-foreground">
                    Get early access to new features
                  </p>
                </div>
                <BryntumSlideToggle value={false} />
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
                <Badge variant="outline">Professional</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="h-5 w-5 text-primary"
                    />
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
              <div className="flex items-center gap-2">
                <BryntumButton
                  cls="fa fa-arrow-up-right-from-square gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                  text="Change Plan"
                />
                <BryntumButton
                  cls="fa fa-ban gap-2 !rounded-full !border-none !bg-destructive !text-white !text-sm !font-medium hover:!bg-destructive/80 !py-1 !min-h-9"
                  text="Cancel Subscription"
                />
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
                    <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">
                      Expires 12/24
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
              <BryntumButton
                cls="fa fa-credit-card gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                text="Add Payment Method"
              />
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
                <BryntumButton
                  cls="fa fa-user-plus gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                  text="Invite Team Member"
                />
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
                        <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
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
                <BryntumButton
                  cls="fa fa-key gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                  text="Generate New Key"
                />
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
                        <FontAwesomeIcon icon={faShield} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{apiKey.name}</p>
                        <p className="text-xs font-mono">{apiKey.key}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Created {apiKey.created}
                      </p>
                      <BryntumButton
                        cls="!rounded-full !border-none !bg-destructive !text-white !text-xs !font-medium hover:!bg-destructive/80 !py-1 !min-h-7 !px-3"
                        text="Revoke"
                      />
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
                    icon: faEnvelope,
                  },
                  {
                    title: "Usage Alerts",
                    description: "Get alerts when approaching limits",
                    icon: faShield,
                  },
                  {
                    title: "Product Updates",
                    description: "Receive information about new features",
                    icon: faGlobe,
                  },
                  {
                    title: "Billing Updates",
                    description: "Get notified about billing changes",
                    icon: faCreditCard,
                  },
                ].map((item, index, arr) => (
                  <Fragment key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="h-5 w-5"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <BryntumSlideToggle value={index < 2} />
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

export default Settings;
