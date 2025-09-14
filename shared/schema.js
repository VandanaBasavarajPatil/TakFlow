import { z } from "zod";

// Validation schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().optional(),
  role: z.string().default("employee"),
});

export const insertProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default("planning"),
  deadline: z.string().optional(),
  progress: z.number().default(0),
  createdBy: z.string(),
});

export const insertTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default("todo"),
  priority: z.string().default("medium"),
  dueDate: z.string().optional(),
  progress: z.number().default(0),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  createdBy: z.string(),
});

export const insertTimeEntrySchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.number().default(0),
  description: z.string().optional(),
});

export const insertCommentSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  content: z.string(),
});