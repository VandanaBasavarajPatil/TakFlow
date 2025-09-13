import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Calendar, Users } from "lucide-react";
import CreateProjectModal from "@/components/modals/create-project-modal";

const statusColors = {
  planning: "bg-muted text-muted-foreground",
  active: "bg-primary text-primary-foreground",
  completed: "bg-accent text-accent-foreground",
};

export default function Projects() {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and track their progress.</p>
          </div>
          <Button
            onClick={() => setShowCreateProject(true)}
            data-testid="button-create-project"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.description || "No description provided"}
                  </CardDescription>
                </div>
                <Badge 
                  className={statusColors[project.status as keyof typeof statusColors]}
                  data-testid={`badge-project-status-${project.status}`}
                >
                  {project.status === 'active' ? 'Active' : 
                   project.status === 'completed' ? 'Completed' : 'Planning'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                    <span>Team</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <AvatarGroup limit={3}>
                    {users.slice(0, 3).map((user: any) => (
                      <Avatar key={user.id} className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  {users.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{users.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-muted-foreground/25">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to get started with task management.
                </p>
                <Button onClick={() => setShowCreateProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateProjectModal
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </div>
  );
}
