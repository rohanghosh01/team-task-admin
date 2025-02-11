"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useRootContext } from "@/contexts/RootContext";

export default function MessageToast() {
  const { toast } = useToast();
  const { showMessage, setShowMessage } = useRootContext();

  useEffect(() => {
    if (showMessage) {
      toast({
        variant: showMessage?.type === "error" ? "destructive" : "default",
        // title: "Something went wrong!",
        title: showMessage?.message || "Something happened.",
        description: showMessage?.description || "",
        // duration: 5000, // Show for 5 seconds
      });

      // Clear the message after showing the toast
      setShowMessage(null);
    }
  }, [showMessage, toast, setShowMessage]);

  return null; // No UI elements since the toast is handled automatically
}
