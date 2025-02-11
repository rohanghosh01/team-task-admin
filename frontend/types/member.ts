export type MemberRole = "admin" | "member";
export type MemberStatus = "active" | "inactive";

export interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  role: MemberRole;
  status: MemberStatus;
  joinedDate: string;
}
