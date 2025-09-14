import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type Task,
  type InsertTask,
  type TimeEntry,
  type InsertTimeEntry,
  type Comment,
  type InsertComment,
  type ActivityLog,
  type UserSettings,
  type ProjectMember
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Project management
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  addProjectMember(projectId: string, userId: string, role?: string): Promise<ProjectMember>;
  getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]>;

  // Task management
  createTask(task: InsertTask): Promise<Task>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  getTasksByUser(userId: string): Promise<Task[]>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Time tracking
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]>;
  getTimeEntriesByUser(userId: string): Promise<TimeEntry[]>;
  updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByTask(taskId: string): Promise<(Comment & { user: User })[]>;

  // Activity logs
  createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
  getActivityLogsByUser(userId: string): Promise<ActivityLog[]>;

  // User settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings>;

  // Analytics
  getTaskMetrics(userId?: string): Promise<{
    completedTasks: number;
    avgCompletionTime: number;
    teamProductivity: number;
    overdueTasks: number;
  }>;

  getDashboardInsights(userId?: string): Promise<{
    focusTime: string;
    completionRate: number;
    teamVelocity: number;
    bestWorkHours: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private timeEntries: Map<string, TimeEntry>;
  private comments: Map<string, Comment>;
  private activityLogs: Map<string, ActivityLog>;
  private userSettings: Map<string, UserSettings>;
  private projectMembers: Map<string, ProjectMember>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.timeEntries = new Map();
    this.comments = new Map();
    this.activityLogs = new Map();
    this.userSettings = new Map();
    this.projectMembers = new Map();

    // Initialize with demo data
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    // Create demo users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const johnDoe: User = {
      id: randomUUID(),
      username: "johndoe",
      email: "john.doe@taskflow.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Doe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      role: "scrum_master",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sarahJohnson: User = {
      id: randomUUID(),
      username: "sarahjohnson",
      email: "sarah.johnson@taskflow.com",
      password: hashedPassword,
      firstName: "Sarah",
      lastName: "Johnson",
      avatar: "https://pixabay.com/get/g34457a6a8ea0310d9fd8261237d726cb36cb8f2f8df39b9b4042fe200f97dec0f4a279b535abfcdb165cf8bb9a51a4748d27c978bdcfe153318a2856bed514c7_1280.jpg",
      role: "employee",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(johnDoe.id, johnDoe);
    this.users.set(sarahJohnson.id, sarahJohnson);

    // Create demo projects
    const ecommerceProject: Project = {
      id: randomUUID(),
      name: "E-commerce Platform",
      description: "Building a modern e-commerce platform with React and Node.js",
      status: "active",
      deadline: new Date("2024-12-15"),
      progress: 75,
      createdBy: johnDoe.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mobileAppProject: Project = {
      id: randomUUID(),
      name: "Mobile App Redesign",
      description: "Redesigning the mobile application for better user experience",
      status: "active",
      deadline: new Date("2025-01-08"),
      progress: 45,
      createdBy: johnDoe.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.set(ecommerceProject.id, ecommerceProject);
    this.projects.set(mobileAppProject.id, mobileAppProject);

    // Create demo tasks
    const tasks: Task[] = [
      {
        id: randomUUID(),
        title: "Implement OAuth integration",
        description: "Set up social login with Google and GitHub",
        status: "todo",
        priority: "high",
        dueDate: new Date("2024-12-20"),
        progress: 0,
        projectId: ecommerceProject.id,
        assigneeId: sarahJohnson.id,
        createdBy: johnDoe.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Fix payment gateway bug",
        description: "Critical issue affecting checkout process",
        status: "in_progress",
        priority: "urgent",
        dueDate: new Date("2024-12-18"),
        progress: 60,
        projectId: ecommerceProject.id,
        assigneeId: johnDoe.id,
        createdBy: johnDoe.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Database optimization",
        description: "Optimize queries for better performance",
        status: "review",
        priority: "medium",
        dueDate: new Date("2024-12-22"),
        progress: 90,
        projectId: ecommerceProject.id,
        assigneeId: sarahJohnson.id,
        createdBy: johnDoe.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "User interface mockups",
        description: "Create high-fidelity designs for dashboard",
        status: "done",
        priority: "low",
        dueDate: new Date("2024-12-15"),
        progress: 100,
        projectId: mobileAppProject.id,
        assigneeId: sarahJohnson.id,
        createdBy: johnDoe.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    tasks.forEach(task => this.tasks.set(task.id, task));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      avatar: insertUser.avatar ?? null,
      role: insertUser.role ?? "employee",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    
    if (updates.password) {
      updatedUser.password = await bcrypt.hash(updates.password, 10);
    }

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      status: insertProject.status ?? "planning",
      description: insertProject.description ?? null,
      deadline: insertProject.deadline ?? null,
      progress: insertProject.progress ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    const userProjects = Array.from(this.projects.values()).filter(
      project => project.createdBy === userId
    );
    
    const memberProjects = Array.from(this.projectMembers.values())
      .filter(member => member.userId === userId)
      .map(member => this.projects.get(member.projectId))
      .filter(Boolean) as Project[];

    return [...userProjects, ...memberProjects];
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async addProjectMember(projectId: string, userId: string, role = "member"): Promise<ProjectMember> {
    const id = randomUUID();
    const member: ProjectMember = {
      id,
      projectId,
      userId,
      role,
      joinedAt: new Date(),
    };
    this.projectMembers.set(id, member);
    return member;
  }

  async getProjectMembers(projectId: string): Promise<(ProjectMember & { user: User })[]> {
    const members = Array.from(this.projectMembers.values()).filter(
      member => member.projectId === projectId
    );
    
    return members.map(member => ({
      ...member,
      user: this.users.get(member.userId)!,
    })).filter(member => member.user);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      status: insertTask.status ?? "todo",
      priority: insertTask.priority ?? "medium",
      description: insertTask.description ?? null,
      progress: insertTask.progress ?? 0,
      projectId: insertTask.projectId ?? null,
      assigneeId: insertTask.assigneeId ?? null,
      dueDate: insertTask.dueDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assigneeId === userId);
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async createTimeEntry(insertEntry: InsertTimeEntry): Promise<TimeEntry> {
    const id = randomUUID();
    const entry: TimeEntry = {
      ...insertEntry,
      id,
      description: insertEntry.description ?? null,
      endTime: insertEntry.endTime ?? null,
      duration: insertEntry.duration ?? 0,
      createdAt: new Date(),
    };
    this.timeEntries.set(id, entry);
    return entry;
  }

  async getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.taskId === taskId);
  }

  async getTimeEntriesByUser(userId: string): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.userId === userId);
  }

  async updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const entry = this.timeEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry = {
      ...entry,
      ...updates,
    };
    this.timeEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async getActiveTimeEntry(userId: string): Promise<TimeEntry | undefined> {
    return Array.from(this.timeEntries.values()).find(
      entry => entry.userId === userId && !entry.endTime
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getCommentsByTask(taskId: string): Promise<(Comment & { user: User })[]> {
    const comments = Array.from(this.comments.values()).filter(
      comment => comment.taskId === taskId
    );
    
    return comments.map(comment => ({
      ...comment,
      user: this.users.get(comment.userId)!,
    })).filter(comment => comment.user);
  }

  async createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const id = randomUUID();
    const activityLog: ActivityLog = {
      ...log,
      id,
      createdAt: new Date(),
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }

  async getActivityLogsByUser(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).filter(log => log.userId === userId);
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async updateUserSettings(userId: string, settingsUpdate: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    
    if (existing) {
      const updated = { ...existing, ...settingsUpdate, updatedAt: new Date() };
      this.userSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const settings: UserSettings = {
        id,
        userId,
        theme: "light",
        notifications: { email: true, push: true, mentions: true },
        timezone: "UTC",
        ...settingsUpdate,
        updatedAt: new Date(),
      };
      this.userSettings.set(id, settings);
      return settings;
    }
  }

  async getTaskMetrics(userId?: string): Promise<{
    completedTasks: number;
    avgCompletionTime: number;
    teamProductivity: number;
    overdueTasks: number;
  }> {
    const allTasks = Array.from(this.tasks.values());
    const userTasks = userId ? allTasks.filter(task => task.assigneeId === userId) : allTasks;
    
    const completedTasks = userTasks.filter(task => task.status === 'done').length;
    const overdueTasks = userTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;

    return {
      completedTasks,
      avgCompletionTime: 2.4, // Mock average in hours
      teamProductivity: 94,
      overdueTasks,
    };
  }

  async getDashboardInsights(userId?: string): Promise<{
    focusTime: string;
    completionRate: number;
    teamVelocity: number;
    bestWorkHours: string;
  }> {
    return {
      focusTime: "6.2h",
      completionRate: 87,
      teamVelocity: 23,
      bestWorkHours: "10-12 AM",
    };
  }
}

export const storage = new MemStorage();
