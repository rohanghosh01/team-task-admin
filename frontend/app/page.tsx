import LoginForm from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <LockKeyhole className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">TeamTasker</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
