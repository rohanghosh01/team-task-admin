"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { recentMembersApi } from "@/services/api.service";

export function TeamOverview() {
  // const members = [
  //   {
  //     name: "John Doe",
  //     role: "Project Manager",
  //     status: "Online",
  //   },
  //   {
  //     name: "Jane Smith",
  //     role: "Developer",
  //     status: "In a meeting",
  //   },
  //   {
  //     name: "Mike Johnson",
  //     role: "Designer",
  //     status: "Away",
  //   },
  // ]

  const [members, setMembers] = useState<any>([]);

  const fetchMembers: any = async () => {
    try {
      let response = await recentMembersApi();
      console.log(">>", response);
      setMembers(response);
    } catch (error) {
      console.log("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-500";
      case "Away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length ? (
          members.map((member: any) => (
            <div key={member.name} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {member.name}
                </p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${getStatusColor(
                  member.status
                )}`}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">There are no recent members</p> // Placeholder text when no members are found.
        )}
      </CardContent>
    </Card>
  );
}
