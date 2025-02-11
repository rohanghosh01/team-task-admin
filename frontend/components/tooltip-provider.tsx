import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

export function ToolTipProvider({
  children,
  name,
  side = "left",
}: {
  children: React.ReactNode;
  name: string;
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
