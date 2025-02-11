"use client";

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
import { login } from "@/services/api.service";
import { useRootContext } from "@/contexts/RootContext";
import { setCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { encrypt } from "@/lib/crypto";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginForm() {
  const { setLoading, setShowMessage } = useRootContext();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { token, user, refreshToken } = await login(values);

      setCookie("auth_token", token);
      setCookie("refresh_token", refreshToken);
      const secureUser = encrypt(JSON.stringify(user));
      setCookie("auth_user", secureUser);
      setLoading(false);
      setShowMessage({
        type: "success",
        message: "Login successful",
        description: "Redirecting to dashboard...",
      });
      window.location.assign("/dashboard");
    } catch (error: any) {
      setShowMessage({
        type: "error",
        message: "Failed to login",
        description: error?.message,
      });
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@company.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
