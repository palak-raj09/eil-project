import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  GraduationCap, 
  User, 
  Calendar, 
  LogOut,
  Settings,
  Bell,
  Target,
  Award
} from "lucide-react";
import { Redirect } from "wouter";

interface TraineeDashboardData {
  trainingProgress: number;
  completedModules: number;
  totalModules: number;
  nextAssignment: string;
  mentor: string;
  upcomingTraining: Array<{
    id: number;
    title: string;
    date: string;
  }>;
}

export default function TraineeDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: dashboardData, isLoading } = useQuery<TraineeDashboardData>({
    queryKey: ["/api/dashboard/trainee"],
    enabled: !!user && user.role === "trainee",
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.role !== "trainee") {
    return <Redirect to="/" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eil-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eil-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eil-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-testid="trainee-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-eil-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">EIL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trainee Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" data-testid="button-notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" data-testid="button-settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar data-testid="avatar-user">
                <AvatarFallback className="bg-eil-primary text-white">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Progress Overview */}
        <Card className="mb-8" data-testid="training-progress">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-eil-primary" />
              Training Progress
            </CardTitle>
            <CardDescription>
              Your journey to becoming a skilled engineer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {dashboardData?.completedModules || 0} of {dashboardData?.totalModules || 0} modules
                </span>
              </div>
              <Progress value={dashboardData?.trainingProgress || 0} className="h-3" />
              <div className="text-right">
                <span className="text-2xl font-bold text-eil-primary">
                  {dashboardData?.trainingProgress || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="stats-cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Modules</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completed-modules">
                {dashboardData?.completedModules || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Modules finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Modules</CardTitle>
              <Target className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-remaining-modules">
                {((dashboardData?.totalModules || 0) - (dashboardData?.completedModules || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Modules to go
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentor</CardTitle>
              <User className="h-4 w-4 text-eil-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold" data-testid="stat-mentor">
                {dashboardData?.mentor || "Not Assigned"}
              </div>
              <p className="text-xs text-muted-foreground">
                Your guide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next Assignment */}
          <Card data-testid="next-assignment">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-eil-primary" />
                Next Assignment
              </CardTitle>
              <CardDescription>
                Your upcoming task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-eil-light/20 rounded-lg">
                <h3 className="font-semibold text-eil-primary mb-2">
                  {dashboardData?.nextAssignment || "No assignment scheduled"}
                </h3>
                <p className="text-sm text-gray-600">
                  Complete this assignment to continue your training progress.
                </p>
                <Button className="mt-4 bg-eil-primary hover:bg-eil-secondary" data-testid="button-start-assignment">
                  Start Assignment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Training */}
          <Card data-testid="upcoming-training">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-eil-primary" />
                Upcoming Training
              </CardTitle>
              <CardDescription>
                Scheduled training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.upcomingTraining?.map((training) => (
                  <div key={training.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{training.title}</span>
                    <Badge variant="outline">
                      {new Date(training.date).toLocaleDateString()}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No upcoming training sessions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8" data-testid="quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used trainee functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col" data-testid="action-view-modules">
                <BookOpen className="h-6 w-6 mb-2" />
                View Modules
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="action-assignments">
                <Target className="h-6 w-6 mb-2" />
                Assignments
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="action-contact-mentor">
                <User className="h-6 w-6 mb-2" />
                Contact Mentor
              </Button>
              <Button variant="outline" className="h-20 flex-col" data-testid="action-training-schedule">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
