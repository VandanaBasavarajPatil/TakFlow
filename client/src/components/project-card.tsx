import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: any;
  members?: any[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors = {
  planning: "bg-muted text-muted-foreground",
  active: "bg-primary text-primary-foreground",
  completed: "bg-accent text-accent-foreground",
};

export default function ProjectCard({ project, members = [], onEdit, onDelete }: ProjectCardProps) {
  const statusColor = statusColors[project.status as keyof typeof statusColors] || statusColors.planning;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {project.description || "No description provided"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={statusColor} data-testid={`badge-project-status-${project.status}`}>
              {project.status === 'active' ? 'Active' : 
               project.status === 'completed' ? 'Completed' : 'Planning'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Due: {project.deadline 
                ? new Date(project.deadline).toLocaleDateString()
                : "No deadline"
              }
            </span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members.length} members</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AvatarGroup limit={3}>
            {members.slice(0, 3).map((member: any) => (
              <Avatar key={member.id} className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs">
                  {member.firstName?.[0]}{member.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          {members.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{members.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
