"use client";

import { cn } from "@/lib/utils";
import { MDXEditor } from "@mdxeditor/editor";
import { FC } from "react";
import { useTheme } from "next-themes";
import { ALL_PLUGINS } from "./_boilerplate";
interface EditorProps {
  markdown: string;
  handler: (markdown: string) => void;
  className?: string;
}

const Editor: FC<EditorProps> = ({ markdown, handler, className }) => {
  const { theme } = useTheme();

  return (
    <div className={cn("editor-wrapper", theme, className)}>
      <MDXEditor
        onChange={handler}
        onError={(msg) => {
          console.warn(msg);
        }}
        markdown={markdown}
        plugins={ALL_PLUGINS}
        spellCheck
        autoFocus
      />
    </div>
  );
};

export default Editor;
