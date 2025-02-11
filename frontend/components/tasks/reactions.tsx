"use client";

import { reactionListApi } from "@/services/api.service";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { ReactionType } from "@/types/project";
import { Button } from "../ui/button";
import { TooltipProvider } from "../ui/tooltip";
import { ToolTipProvider } from "../tooltip-provider";

interface Props {
  commentId: string;
  reactions: ReactionType[];
  setReactions: (reactions: ReactionType[]) => void;
}

const Reactions: NextPage<Props> = ({ commentId, reactions, setReactions }) => {
  const [groupedReactions, setGroupedReactions] = useState<{
    [key: string]: { count: number; users: { name: string; email: string }[] };
  }>({});
  const [showAll, setShowAll] = useState(false);

  // Group reactions by emoji
  useEffect(() => {
    const group = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.reaction]) {
        acc[reaction.reaction] = { count: 0, users: [] };
      }
      acc[reaction.reaction].count += 1;
      acc[reaction.reaction].users.push({
        name: reaction.name,
        email: reaction.email,
      });
      return acc;
    }, {} as { [key: string]: { count: number; users: { name: string; email: string }[] } });

    setGroupedReactions(group);
  }, [reactions]);

  const handleReactionToggle = async (emoji: string) => {
    // Toggle reaction logic here (add or remove emoji)
    // const response = await reactionListApi.toggleReaction(commentId, emoji);
    // if (response.success) {
    //   setReactions(response.updatedReactions); // Update reactions from the API response
    // }
  };

  if (!reactions.length || Object.keys(reactions?.[0]).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mr-1">
      {Object.entries(groupedReactions)
        .slice(0, showAll ? Object.keys(groupedReactions).length : 10) // Show up to 10 reactions unless "show all" is clicked
        .map(([emoji, data]) => (
          <ToolTipProvider
            key={emoji}
            name={`Reacted by: ${data.users
              .map((user) => user.name)
              .join(", ")}`}
          >
            <Button
              variant="outline"
              className="h-8 rounded-full opacity-70 flex items-center justify-center"
              // onClick={() => handleReactionToggle(emoji)}
            >
              {emoji}
              {data.count > 1 && <span className="text-xs">{data.count}</span>}
            </Button>
          </ToolTipProvider>
        ))}

      {/* "Show more" button */}
      {Object.keys(groupedReactions).length > 10 && !showAll && (
        <Button variant="outline" onClick={() => setShowAll(true)}>
          +{Object.keys(groupedReactions).length - 10}
        </Button>
      )}
    </div>
  );
};

export default Reactions;
