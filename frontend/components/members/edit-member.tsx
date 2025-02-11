import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/types/auth";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { updateMember } from "@/services/api.service";
import { useDashboard } from "@/contexts/dashboardContext";
import { useRootContext } from "@/contexts/RootContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: User;
}

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

const EditMember: NextPage<Props> = ({ open, onOpenChange, member }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "member",
    },
  });

  const { updateMemberData } = useDashboard();
  const { setShowMessage } = useRootContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setValue("name", member?.name || "");
    form.setValue("email", member.email || "");
    form.setValue("role", member.role || "");
  }, [member]);

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      // Update the member in the database
      // await updateMember(values);
      let res = await updateMember(member._id, values);
      setShowMessage({
        message: "Member updated successfully!",
        type: "success",
      });
      updateMemberData(member._id, values);
      setLoading(false);
      // Close the dialog and update the member list
      onOpenChange(false);
      // onSave(values);
    } catch (error: any) {
      setShowMessage({
        message: error?.message || "Failed to update member",
        type: "error",
      });
      setLoading(false);
      console.error("Error updating member:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">
                Edit Team Member
              </DialogTitle>
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
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                {loading ? (
                  <Button disabled={loading}>
                    <span>Updating...</span>
                  </Button>
                ) : (
                  <Button type="submit">Update Member</Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMember;
