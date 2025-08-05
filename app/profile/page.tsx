"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/getUser";
import { updateProfile, changePassword } from "@/lib/api/profile";
import {
  Package,
  Heart,
  ShoppingCart,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import { getOrdersCount } from "@/lib/api/orders";
import { getCartCount } from "@/lib/api/cart";
import { getWishlistCount } from "@/lib/api/wishlist";
import { toast } from "sonner";

// Form schema
const profileFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password form schema
const passwordFormSchema = z
  .object({
    old_password: z.string().min(1, {
      message: "Current password is required.",
    }),
    new_password: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      city: "",
      avatar_url: "",
    },
  });

  // Initialize password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        if (!userData) {
          router.push("/auth/login");
          return;
        }
        setUser(userData);
        console.log(userData);

        // Set form values
        form.reset({
          first_name: userData.first_name,
          last_name: userData.last_name,
          city: userData.city || "",
          avatar_url: userData.avatar_url || "",
        });

        // Fetch counts
        try {
          const orders = await getOrdersCount();
          setOrdersCount(orders);

          const cart = await getCartCount();
          setCartCount(cart);

          const wishlist = await getWishlistCount();
          setWishlistCount(wishlist);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again later.");
        router.push("/auth/login");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, form]);

  // Handle form submission
  async function onSubmit(data: ProfileFormValues) {
    setUpdating(true);
    try {
      await updateProfile(data);

      // Update local user state
      setUser({
        ...user,
        ...data,
      });

      toast.success("Profile updated successfully!");

      // Refresh the page to get updated data
      router.refresh();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.detail || "Failed to update profile. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  }

  // Handle password form submission
  async function onChangePassword(data: PasswordFormValues) {
    setChangingPassword(true);
    try {
      await changePassword(data);

      toast.success("Password changed successfully!");

      // Reset form
      passwordForm.reset({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(
        error.detail || "Failed to change password. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  // Format date with error handling
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";

      // Trim to milliseconds if fractional seconds are too long
      const trimmedDateString = dateString.replace(/\.(\d{3})\d*Z$/, ".$1Z");

      const date = new Date(trimmedDateString);

      if (isNaN(date.getTime())) return "N/A";

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-[#22AA86]">
                  <AvatarImage
                    src={
                      user.avatar_url ||
                      "/placeholder.svg?height=96&width=96&query=person" ||
                      "/placeholder.svg"
                    }
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <AvatarFallback className="bg-[#22AA86] text-white text-2xl">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-center">
                  {user.first_name} {user.last_name}
                </CardTitle>
                <Badge className="mt-2 bg-[#22AA86]">{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#22AA86]" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#22AA86]" />
                    <span className="text-sm">{user.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#22AA86]" />
                  <span className="text-sm">
                    Member since {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#22AA86]/10 mb-2">
                    <Package className="h-5 w-5 text-[#22AA86]" />
                  </div>
                  <span className="text-xl font-semibold">{ordersCount}</span>
                  <span className="text-xs text-muted-foreground">Orders</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#22AA86]/10 mb-2">
                    <Heart className="h-5 w-5 text-[#22AA86]" />
                  </div>
                  <span className="text-xl font-semibold">{wishlistCount}</span>
                  <span className="text-xs text-muted-foreground">
                    Wishlist
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#22AA86]/10 mb-2">
                    <ShoppingCart className="h-5 w-5 text-[#22AA86]" />
                  </div>
                  <span className="text-xl font-semibold">{cartCount}</span>
                  <span className="text-xs text-muted-foreground">Cart</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="w-full border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10"
                  onClick={() => router.push("/orders")}
                >
                  My Orders
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-[#22AA86] text-[#22AA86] hover:bg-[#22AA86]/10"
                  onClick={() => router.push("/wishlist")}
                >
                  Wishlist
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information here. Changes will be
                    reflected across the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter avatar URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground mt-1">
                              Enter a URL for your profile picture. For best
                              results, use a square image.
                            </p>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#22AA86] hover:bg-[#1c8f70]"
                          disabled={updating}
                        >
                          {updating ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onChangePassword)}
                      className="space-y-6"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="old_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your current password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground mt-1">
                              Password must be at least 8 characters long.
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm your new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#22AA86] hover:bg-[#1c8f70]"
                          disabled={changingPassword}
                        >
                          {changingPassword
                            ? "Changing Password..."
                            : "Change Password"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="grid gap-4">
                      {/* Placeholder for notification settings */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your orders
                          </p>
                        </div>
                        <div className="h-6 w-11 bg-[#22AA86] rounded-full relative cursor-not-allowed">
                          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product Recommendations</p>
                          <p className="text-sm text-muted-foreground">
                            Receive personalized product recommendations
                          </p>
                        </div>
                        <div className="h-6 w-11 bg-[#22AA86] rounded-full relative cursor-not-allowed">
                          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-muted-foreground">
                            Receive our weekly newsletter
                          </p>
                        </div>
                        <div className="h-6 w-11 bg-muted rounded-full relative cursor-not-allowed">
                          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>
                    <div className="grid gap-4">
                      {/* Placeholder for privacy settings */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">
                            Control who can see your profile
                          </p>
                        </div>
                        <div className="h-6 w-11 bg-[#22AA86] rounded-full relative cursor-not-allowed">
                          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Usage</p>
                          <p className="text-sm text-muted-foreground">
                            Allow us to use your data for personalization
                          </p>
                        </div>
                        <div className="h-6 w-11 bg-[#22AA86] rounded-full relative cursor-not-allowed">
                          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Note: Settings functionality is currently under development.
                    Changes made here will not be saved.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
