import React from "react";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertCodeBlock,
  InsertTable,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";

export async function expressImageUploadHandler(image: File) {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch("/uploads/new", {
    method: "POST",
    body: formData,
  });
  const json = (await response.json()) as { url: string };
  return json.url;
}

export const ALL_PLUGINS = [
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <ListsToggle />
        <Separator />
        <BlockTypeSelect />
        <CreateLink />
        <InsertImage />
        <Separator />
        <InsertCodeBlock />
        <InsertTable />
      </>
    ),
  }),
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  markdownShortcutPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    imageUploadHandler: async () =>
      Promise.resolve("https://picsum.photos/200/300"),
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
  //   sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "Plain Text",
      tsx: "TypeScript",
      "": "Unspecified",
    },
  }),
];
export const ALL_PLUGINS_VIEW = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  markdownShortcutPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    imageUploadHandler: async () =>
      Promise.resolve("https://picsum.photos/200/300"),
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "javaScript" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "Plain Text",
      tsx: "TypeScript",
      "": "Unspecified",
    },
  }),
];
