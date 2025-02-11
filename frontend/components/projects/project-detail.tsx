"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";
import { Member } from "@/types/member";
import { useAuth } from "@/contexts/authContext";
import { AddMemberDialog } from "@/components/members/add-member-dialog";
import { UserPlus, UserMinus } from "lucide-react";

interface ProjectDetailProps {
  project: Project;
  members: Member[];
  onAddMember: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export function ProjectDetail({
  project,
  members,
  onAddMember,
  onRemoveMember,
}: ProjectDetailProps) {
  const { auth } = useAuth();
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const isAdmin = auth.user?.role === "admin";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {project.status}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {project.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Team Members</h3>
              {isAdmin && (
                <Button onClick={() => setShowAddMemberDialog(true)} size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <AddMemberDialog
          open={showAddMemberDialog}
          onChange={setShowAddMemberDialog}
          // onAddMember={onAddMember}
        />
      )}
    </div>
  );
}
