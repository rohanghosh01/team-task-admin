"use client";
import { NextPage } from "next";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CommentType, ReactionType } from "@/types/project";
import { useTheme } from "next-themes";
import { formatDate } from "@/lib/formatDate";
import { Button } from "../ui/button";
import { SmilePlus } from "lucide-react";
import { ToolTipProvider } from "../tooltip-provider";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import SaveChangeButtonComponent from "@/lib/save-change-btn";
import {
  addReactionApi,
  commentDeleteApi,
  commentUpdateApi,
  reactionListApi,
} from "@/services/api.service";
import EmojiComponent from "@/lib/emoji";
import Reactions from "./reactions";
const EditorComp = dynamic(() => import("@/components/markdown-editor"), {
  ssr: false,
});
interface Props {
  comment: CommentType;
}

const CommentDetail: NextPage<Props> = ({ comment: data }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState<CommentType | null>(data);
  const [reactions, setReactions] = useState<ReactionType[]>(
    comment?.reactions || []
  );
  const [input, setInput] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  useEffect(() => {
    setComment(data);
    setInput(data.comment);
  }, [data]);

  const handleSave = async () => {
    if (!comment) return;
    try {
      await commentUpdateApi(comment._id, {
        comment: input,
      });
      setComment((prev: any) => ({ ...prev, comment: input, isEdited: true }));
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to update comment", error);
    }
  };
  const handleDelete = async () => {
    if (!comment) return;
    try {
      await commentDeleteApi(comment._id);
      setComment(null);
    } catch (error) {
      console.log("Failed to handleDelete", error);
    }
  };

  const handleReaction = async (value: string) => {
    if (!comment) return;
    try {
      await addReactionApi({
        commentId: comment._id,
        reaction: value,
      });
    } catch (error) {
      console.log("Failed to handle reaction", error);
    }
  };

  if (!comment) {
    return null;
  }

  return (
    <Card className="border-x-0 border-b-1 border-t-0 rounded-none">
      <CardContent>
        <div className="flex items-center gap-1">
          <Avatar className="w-10 h-10">
            <AvatarImage />
            <AvatarFallback>
              {comment?.user?.name?.slice(0, 2)?.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p>{comment?.user?.name}</p>
          <p className="text-xs text-muted-foreground ml-2">
            {formatDate(comment?.updatedAt as string)}
          </p>
          {comment?.isEdited && (
            <span className="text-xs font-semibold text-muted-foreground ml-2">
              Edited
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div>
                <Suspense fallback={null}>
                  <EditorComp
                    markdown={comment?.comment}
                    handler={(data) => setInput(data)}
                    className="min-h-[200px] min-w-[90%] border p-2"
                  />
                </Suspense>
                <SaveChangeButtonComponent
                  handleSave={handleSave}
                  setOpen={setIsEditing}
                  setInput={setInput}
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <MarkdownPreview
                  source={comment?.comment}
                  style={{
                    padding: 16,
                    background: "transparent",
                  }}
                  wrapperElement={{
                    "data-color-mode": theme === "dark" ? "dark" : "light",
                  }}
                />
                <div className="flex text-xs  items-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="opacity-70"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="link" size="sm" className="opacity-70">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the comment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive/70 text-white hover:bg-destructive"
                          onClick={handleDelete}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Reactions
                    commentId={comment?._id}
                    reactions={reactions}
                    setReactions={setReactions}
                  />

                  <ToolTipProvider name="Add reaction" side="bottom">
                    <EmojiComponent
                      handleChange={handleReaction}
                      reaction={true}
                      open={emojiOpen}
                      setOpen={setEmojiOpen}
                      // className="absolute -top-24 -right-40"
                    >
                      <Button
                        variant="outline"
                        className="w-4 h-6 rounded-full opacity-70"
                        onClick={() => setEmojiOpen(!emojiOpen)}
                      >
                        <SmilePlus className="w-4 h-4" />
                      </Button>
                    </EmojiComponent>
                  </ToolTipProvider>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentDetail;
