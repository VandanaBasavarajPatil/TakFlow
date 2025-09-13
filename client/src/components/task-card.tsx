import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: any;
  project?: any;
  assignee?: any;
  onStatusChange?: (status: string) => void;
}

const priorityColors = {
  low: "text-accent bg-accent/10 border-accent/20",
  medium: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  high: "text-chart-1 bg-chart-1/10 border-chart-1/20",
  urgent: "text-destructive bg-destructive/10 border-destructive/20",
};

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

export default function TaskCard({ task, project, assignee, onStatusChange }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const priorityColorClass = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium;
  
  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <Card 
      className={cn(
        "task-card cursor-move border border-border shadow-sm",
        `priority-${task.priority}`,
        isDragging && "opacity-50",
        task.status === 'done' && "opacity-75"
      )}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={cn("text-xs font-medium border", priorityColorClass)}>
            {task.status === 'done' ? 'Completed' : `${task.priority} Priority`}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((status) => (
                <DropdownMenuItem 
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  data-testid={`move-task-${status.value}`}
                >
                  Move to {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h4 className={cn(
          "font-medium text-foreground mb-2",
          task.status === 'done' && "line-through"
        )}>
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.progress > 0 && task.status !== 'done' && (
          <div className="mb-3">
            <Progress value={task.progress} className="h-2" />
            <span className="text-xs text-muted-foreground mt-1">
              {task.progress}% complete
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {assignee.firstName?.[0]}{assignee.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            )}
            {assignee && (
              <span className="text-xs text-muted-foreground">
                {assignee.firstName} {assignee.lastName}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            {task.status === 'done' && (
              <div className="text-accent">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {project && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {project.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
