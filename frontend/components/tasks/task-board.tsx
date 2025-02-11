import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/task";
import { TaskCardSkeleton } from "./task-skeleton";

interface TaskBoardProps {
  tasksByStatus: { [key in TaskStatus]: Task[] };
  counts: { [key in TaskStatus]: number };
  onTaskUpdate: (task: Task, sourceStatus: TaskStatus) => void;
  setCounts: React.Dispatch<
    React.SetStateAction<{ [key in TaskStatus]: number }>
  >;
  isLoading: { [key in TaskStatus]: boolean };
  onLoadMore: (status: TaskStatus) => void;
  hasMore: { [key in TaskStatus]: boolean };
  setTasksByStatus: any;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasksByStatus,
  counts,
  onTaskUpdate,
  isLoading,
  onLoadMore,
  hasMore,
  setCounts,
}) => {
  const statuses: TaskStatus[] = ["todo", "in_progress", "in_review", "done"];

  const getStatusTitle = (status: TaskStatus): string => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "in_review":
        return "In Review";
      case "done":
        return "Done";
      default:
        return "";
    }
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // If moving between different statuses, update the backend
    if (sourceStatus !== destinationStatus) {
      const movedTask = tasksByStatus[sourceStatus][source.index];
      onTaskUpdate({ ...movedTask, status: destinationStatus }, sourceStatus);
    }

    // Update counts
    const updatedCounts: any = { ...counts };

    updatedCounts[sourceStatus] = updatedCounts[sourceStatus] - 1;
    updatedCounts[destinationStatus] = updatedCounts[destinationStatus] + 1;

    setCounts(updatedCounts);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-md">
        {statuses.map((status) => (
          <div key={status} className="flex flex-col space-y-4 ">
            <h2 className="text-lg font-bold sticky top-[4rem]  bg-background z-50 p-2">
              {getStatusTitle(status)} ({counts[status]})
            </h2>

            <Droppable
              droppableId={status}
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col space-y-3 p-4 h-full min-h-[200px]"
                >
                  {tasksByStatus[status]?.length ? (
                    tasksByStatus[status].map((task, index) => (
                      <Draggable
                        key={task?._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <>{!isLoading[status] && "No task found"}</>
                  )}

                  {provided.placeholder}

                  {/* Loading Skeleton */}

                  {isLoading[status] &&
                    Array.from({ length: 7 }).map((_, index) => (
                      <TaskCardSkeleton key={index} />
                    ))}

                  {/* Load More Button */}
                  {hasMore[status] && (
                    <Button
                      variant="outline"
                      onClick={() => onLoadMore(status)}
                      disabled={isLoading[status]}
                    >
                      {isLoading[status] ? "Loading..." : "Load More"}
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
