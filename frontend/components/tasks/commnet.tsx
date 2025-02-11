import { NextPage } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addCommentApi, commentListApi } from "@/services/api.service";
import { CommentType } from "@/types/project";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
const EditorComp = dynamic(() => import("@/components/markdown-editor"), {
  ssr: false,
});
import CommentDetail from "./comment-detail";
import SaveChangeButtonComponent from "@/lib/save-change-btn";

interface Props {
  taskId: string;
}

const DelayedButtonComponent = ({
  handleSave,
  setCommentOpen,
  setInput,
}: any) => {
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    // Set a delay of 2 seconds (2000 milliseconds)
    const timer = setTimeout(() => {
      setShowDiv(true); // Set state to true after the delay
    }, 200); // 2000 ms delay

    // Cleanup the timer if the component is unmounted before the timeout
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showDiv && (
        <div className="flex gap-2 p-3 bg-background">
          <Button
            onClick={handleSave}
            className="bg-blue-400 hover:bg-blue-500  h-8"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setCommentOpen(false);
              setInput("");
            }}
            className="h-8"
            variant="ghost"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

const CommentPage: NextPage<Props> = ({ taskId }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 0 }) => {
    try {
      const query = {
        offset: pageParam,
        limit: 12,
      };
      const { results, nextOffset } = await commentListApi(taskId, query);
      return { data: results, nextCursor: nextOffset };
    } catch (error) {
      return { data: [], nextCursor: null };
    }
  };

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments"],
      queryFn: fetchComments,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      retry: false,
      refetchOnWindowFocus: false, // Disable refetch on window focus
    });

  const handleSave = async () => {
    try {
      let result = await addCommentApi({ taskId, comment: input });
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData) return oldData;

        const newPage = {
          data: [result, ...oldData.pages[0].data],
          nextCursor: oldData.pages[0].nextCursor,
        };

        const updatedData = {
          ...oldData,
          pages: [newPage, ...oldData.pages.slice(1)],
        };

        console.log("Updated cache:", updatedData); // Check the cache
        return updatedData;
      });

      setCommentOpen(false);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const comments = data?.pages.flatMap((page) => page.data) || [];

  if (!comments?.length && isFetching && !isFetchingNextPage) {
    return (
      <div className="border p-4 rounded-md">
        <div className="flex space-x-4 mt-4">
          <Skeleton className="h-8 w-24" /> {/* Comments Tab */}
          <Skeleton className="h-8 w-24" /> {/* Activity Tab */}
        </div>

        {/* Comment Input */}
        <div className="flex items-center space-x-4 mt-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex space-x-4 ml-6 mb-4">
        <Avatar>
          <AvatarImage />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        {commentOpen ? (
          <div className="w-full h-full">
            <Suspense fallback={null}>
              <EditorComp
                markdown={input as string}
                handler={(data) => setInput(data)}
                className="min-h-[200px] min-w-[90%] border p-2"
              />
            </Suspense>
            <SaveChangeButtonComponent
              handleSave={handleSave}
              setOpen={setCommentOpen}
              setInput={setInput}
            />

            {/* <DelayedButtonComponent
              handleSave={handleSave}
              setCommentOpen={setCommentOpen}
              setInput={setInput}
            /> */}
          </div>
        ) : (
          <div
            className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCommentOpen(true)}
          >
            <span className="text-muted-foreground">Add a comment...</span>
          </div>
        )}
      </div>
      <Separator />

      {comments?.length ? (
        <div className="flex flex-col gap-2">
          {comments.map((comment: CommentType, index: number) => (
            <CommentDetail key={index} comment={comment} />
          ))}
          {hasNextPage && (
            <div ref={ref} className="text-center text-muted-foreground">
              {isFetchingNextPage ? "Loading more comments..." : "Load more"}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CommentPage;
