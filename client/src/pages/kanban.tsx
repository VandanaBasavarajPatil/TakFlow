import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import CreateTaskModal from "@/components/modals/create-task-modal";

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted-foreground" },
  { id: "in_progress", title: "In Progress", color: "bg-primary" },
  { id: "review", title: "Review", color: "bg-chart-4" },
  { id: "done", title: "Done", color: "bg-accent" },
];

export default function Kanban() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/tasks");
      return res.json();
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/projects");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await authenticatedRequest("GET", "/api/users");
      return res.json();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: any }) => {
      const res = await authenticatedRequest("PUT", `/api/tasks/${taskId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task: any) => task.status === status);
  };

  const getTaskCount = (status: string) => {
    return getTasksByStatus(status).length;
  };

  const handleTaskMove = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({
      taskId,
      updates: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kanban Board</h1>
        <p className="text-muted-foreground">Manage your tasks with drag-and-drop functionality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="kanban-column">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getTaskCount(column.id)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateTask(true)}
                  data-testid={`button-add-task-${column.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {columnTasks.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projects.find((p: any) => p.id === task.projectId)}
                    assignee={users.find((u: any) => u.id === task.assigneeId)}
                    onStatusChange={(newStatus) => handleTaskMove(task.id, newStatus)}
                  />
                ))}
                
                {columnTasks.length === 0 && (
                  <Card className="border-2 border-dashed border-muted-foreground/25">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No tasks in {column.title.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateTaskModal
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
      />
    </div>
  );
}
