"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/data-display/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui/data-display/avatar";
import { Badge } from "components/ui/data-display/badge";
import { Separator } from "components/ui/layout/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/navigation/tabs";
import { BryntumButton, BryntumSlideToggle, BryntumTextField } from "@bryntum/core-react-thin";
import { Toast } from "@bryntum/core-thin";

const Profile = () => {
  const handleSaveProfile = () => {
    Toast.show({
      html: "Profile updated successfully",
      timeout: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User profile"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">
                  john.doe@example.com
                </p>
                <div className="flex mt-4 space-x-2">
                  <Badge variant="outline">Admin</Badge>
                  <Badge variant="outline">Developer</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Stats</CardTitle>
                <CardDescription>Your account statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm font-medium">March 2022</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Products Used</span>
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Calls (30d)</span>
                    <span className="text-sm font-medium">1.2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <BryntumTextField
                        id="first-name"
                        label="First Name"
                        cls="text-input !w-full"
                        labelPosition="above"
                        value="John"
                      />
                      <BryntumTextField
                        id="last-name"
                        label="Last Name"
                        cls="text-input !w-full"
                        labelPosition="above"
                        value="Doe"
                      />
                    </div>
                    <BryntumTextField
                      id="email"
                      label="Email"
                      cls="text-input !w-full"
                      labelPosition="above"
                      value="john.doe@example.com"
                    />
                    <BryntumTextField
                      id="company"
                      label="Company"
                      cls="text-input !w-full"
                      labelPosition="above"
                      value="Acme Inc."
                    />
                  </div>
                  <BryntumButton
                    cls="b-fa b-fa-save gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                    onClick={handleSaveProfile}
                    text="Save Changes"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <BryntumTextField
                      id="current-password"
                      label="Current Password"
                      cls="text-input !w-full"
                      labelPosition="above"
                      value="********"
                    />
                  </div>
                  <div className="space-y-2">
                    <BryntumTextField
                      id="new-password"
                      label="New Password"
                      cls="text-input !w-full"
                      labelPosition="above"
                      value="********"
                    />
                  </div>
                  <div className="space-y-2">
                    <BryntumTextField
                      id="confirm-password"
                      label="Confirm New Password"
                      cls="text-input !w-full"
                      labelPosition="above"
                      value="********"
                    />
                  </div>
                  <BryntumButton
                    cls="b-fa b-fa-lock gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                    onClick={() =>
                      Toast.show({
                        html: "Password updated successfully",
                        timeout: 20000,
                      })
                    }
                    text="Change Password"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Two-factor authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <BryntumSlideToggle value={false} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how we contact you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about updates
                      </p>
                    </div>
                    <BryntumSlideToggle value={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Product updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features
                      </p>
                    </div>
                    <BryntumSlideToggle value={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Usage alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when you're close to your plan limits
                      </p>
                    </div>
                    <BryntumSlideToggle value={true} />
                  </div>
                  <BryntumButton
                    cls="b-fa b-fa-save gap-2 !rounded-full !border-none !bg-primary !text-white !text-sm !font-medium !bg-card hover:!bg-teal-300 !py-1 !min-h-9"
                    text="Save Preferences"
                    onClick={() =>
                      Toast.show({
                        html: "Preferences updated successfully",
                        timeout: 20000,
                      })
                    }
                  >
                  </BryntumButton>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
