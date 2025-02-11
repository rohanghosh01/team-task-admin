"use client";

import { cn } from "@/lib/utils";
import { MDXEditor } from "@mdxeditor/editor";
import { FC } from "react";
import { useTheme } from "next-themes";
import { ALL_PLUGINS_VIEW } from "./_boilerplate";
interface EditorProps {
  markdown: string;
  className?: string;
}

const Render: FC<EditorProps> = ({ markdown, className }) => {
  const { theme } = useTheme();

  return (
    <div className={cn("editor-wrapper editor-disabled", theme)}>
      <MDXEditor
        onError={(msg) => {
          console.warn(msg);
        }}
        markdown={markdown}
        plugins={ALL_PLUGINS_VIEW}
        readOnly
      />
    </div>
  );
};

export default Render;
