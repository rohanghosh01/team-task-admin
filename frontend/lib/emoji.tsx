"use client";
import { NextPage } from "next";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState } from "react";

interface Props {
  className?: string;
  reaction: boolean;
  handleChange: (emoji: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

const EmojiComponent: NextPage<Props> = ({
  reaction,
  open,
  setOpen,
  className,
  handleChange,
  children,
}) => {
  const { theme } = useTheme();
  const [reactions, setReactions] = useState<string[]>([
    "👍",
    "❤️",
    "😄",
    "😢",
    "🙏",
    "👎",
    "😡",
  ]);

  const handleEmojiSelect = (emoji: any) => {
    setReactions((prev) => [...prev, emoji.native]);
    handleChange(emoji.native);
    setOpen(false); // Close the popover after emoji selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={`flex items-center gap-2 rounded-full p-2 w-full`}
        // side="top"
        // sideOffset={-10}
        // align="center"
        // avoidCollisions
      >
        {reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => handleChange(reaction)}
            className="emoji-reaction"
          >
            {reaction}
          </button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="text-2xl text-gray-400 hover:text-white transition-colors duration-150"
              aria-label="Add Reaction"
            >
              +
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-transparent border-0"
            side="top"
            sideOffset={-10}
            align="center"
            avoidCollisions
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={theme === "dark" ? "dark" : "light"}
              previewPosition="none"
              skinTonePosition="none"
            />
          </PopoverContent>
        </Popover>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiComponent;
