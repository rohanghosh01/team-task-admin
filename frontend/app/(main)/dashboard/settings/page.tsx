"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { updateUserApi } from "@/services/api.service";
import { useRootContext } from "@/contexts/RootContext";
import PasswordBtn from "@/components/password-btn";

// Import react-hook-form & zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";

// Define validation schema using Zod
const userSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type UserType = z.infer<typeof userSchema>;

export default function SettingsPage() {
  const {
    auth: { user },
    logout,
    login,
  } = useAuth();
  const { setShowMessage } = useRootContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setTheme, theme } = useTheme();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user, reset]);

  const handleSave = async (data: UserType) => {
    try {
      await updateUserApi(data);
      if (user) {
        login({
          ...user,
          name: data.name,
        });
      }

      setShowMessage({
        message: "User data updated successfully!",
        type: "success",
      });

      if (data.password) {
        setShowMessage({
          message: "Password changed! redirecting to login",
          type: "success",
        });
        setTimeout(() => {
          // Reset password field and set visibility
          setValue("password", "");
          setValue("confirmPassword", "");
          setIsPasswordVisible(false);
          logout();
        }, 2000);
      }
    } catch (error) {
      setShowMessage({
        message: "Failed to update user data",
        type: "error",
      });
    }
  };

  const handleTheme = (theme: "dark" | "light" | "system") => {
    setTheme(theme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(handleSave)}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    {...register("email")}
                  />
                </div>

                {isPasswordVisible && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <PasswordBtn
                        label="New password"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <PasswordBtn
                        label="Confirm password"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {!isPasswordVisible && (
                  <div className="flex items-center justify-end">
                    <Button
                      variant="link"
                      className="text-blue-400"
                      onClick={() => setIsPasswordVisible(true)}
                    >
                      Change password
                    </Button>
                  </div>
                )}
                <div className="flex mt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how TeamTasker looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={theme === "light" ? "secondary" : "outline"}
                    onClick={() => handleTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "secondary" : "outline"}
                    onClick={() => handleTheme("dark")}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "secondary" : "outline"}
                    onClick={() => handleTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
