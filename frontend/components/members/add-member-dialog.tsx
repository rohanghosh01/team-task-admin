"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRootContext } from "@/contexts/RootContext";
import { addMember } from "@/services/api.service";
import { useDashboard } from "@/contexts/dashboardContext";

// Define the schema with Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  role: z.enum(["member", "admin"], {
    invalid_type_error: "Role is required.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddMemberDialogProps {
  open: boolean;
  onChange: (open: boolean) => void;
}

export function AddMemberDialog({ open, onChange }: AddMemberDialogProps) {
  const { setLoading, setShowMessage } = useRootContext();
  const { addMemberData } = useDashboard();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      const result = await addMember(values);
      addMemberData(result);
      setShowMessage({
        message: "Member added successfully!",
        type: "success",
      });
      setLoading(false);
      form.reset(); // Reset form on successful submission
      onChange(false);
    } catch (error: any) {
      setShowMessage({
        message: error?.message || "Field to add member",
        type: "error",
      });
      setLoading(false);
      console.log("Field to add member", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    onChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Member</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
