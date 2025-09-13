import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Kanban from "@/pages/kanban";
import Calendar from "@/pages/calendar";
import Projects from "@/pages/projects";
import Analytics from "@/pages/analytics";
import TimeTracking from "@/pages/time-tracking";
import Team from "@/pages/team";
import Settings from "@/pages/settings";
import AppLayout from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <AppLayout><Dashboard /></AppLayout>} />
      <Route path="/kanban" component={() => <AppLayout><Kanban /></AppLayout>} />
      <Route path="/calendar" component={() => <AppLayout><Calendar /></AppLayout>} />
      <Route path="/projects" component={() => <AppLayout><Projects /></AppLayout>} />
      <Route path="/analytics" component={() => <AppLayout><Analytics /></AppLayout>} />
      <Route path="/time-tracking" component={() => <AppLayout><TimeTracking /></AppLayout>} />
      <Route path="/team" component={() => <AppLayout><Team /></AppLayout>} />
      <Route path="/settings" component={() => <AppLayout><Settings /></AppLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
