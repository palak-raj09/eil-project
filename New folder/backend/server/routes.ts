import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Protected dashboard data endpoints
  app.get("/api/dashboard/management", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "management") return res.sendStatus(403);
    
    res.json({
      totalEmployees: 1250,
      activeProjects: 45,
      pendingApprovals: 12,
      recentActivities: [
        { id: 1, action: "New project approved", timestamp: new Date().toISOString() },
        { id: 2, action: "Employee onboarding completed", timestamp: new Date().toISOString() },
        { id: 3, action: "Budget review scheduled", timestamp: new Date().toISOString() }
      ]
    });
  });

  app.get("/api/dashboard/employee", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "employee") return res.sendStatus(403);
    
    res.json({
      assignedTasks: 8,
      completedTasks: 23,
      upcomingDeadlines: 3,
      recentUpdates: [
        { id: 1, title: "Project milestone completed", date: new Date().toISOString() },
        { id: 2, title: "Training session scheduled", date: new Date().toISOString() },
        { id: 3, title: "Performance review due", date: new Date().toISOString() }
      ]
    });
  });

  app.get("/api/dashboard/trainee", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "trainee") return res.sendStatus(403);
    
    res.json({
      trainingProgress: 65,
      completedModules: 8,
      totalModules: 12,
      nextAssignment: "Safety Protocols Assessment",
      mentor: "Dr. Sarah Johnson",
      upcomingTraining: [
        { id: 1, title: "Advanced Engineering Principles", date: new Date().toISOString() },
        { id: 2, title: "Project Management Basics", date: new Date().toISOString() }
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
