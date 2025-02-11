import { NextPage } from "next";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

interface Props {}

const ProjectSkeleton: NextPage<Props> = ({}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-1/2 h-6 bg-muted-foreground/10 rounded animate-pulse"></div>
          <div className="w-20 h-6 bg-muted-foreground/10 rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-4 bg-muted-foreground/10 rounded animate-pulse"></div>
        <div className="w-3/4 h-4 bg-muted-foreground/10 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="w-20 h-4 bg-muted-foreground/10 rounded animate-pulse"></span>
            <span className="w-10 h-4 bg-muted-foreground/10 rounded animate-pulse"></span>
          </div>
          <div className="w-full h-2 bg-muted-foreground/10 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-muted-foreground/10 rounded-full animate-pulse"></div>
            <span className="w-24 h-4 bg-muted-foreground/10 rounded animate-pulse"></span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-muted-foreground/10 rounded-full animate-pulse"></div>
            <span className="w-20 h-4 bg-muted-foreground/10 rounded animate-pulse"></span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex -space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border-2 border-background h-8 w-8 bg-muted-foreground/10 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectSkeleton;
