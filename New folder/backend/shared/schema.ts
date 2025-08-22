import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["management", "employee", "trainee"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: text("is_active").notNull().default("true"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const passwordResets = pgTable("password_resets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: text("used").notNull().default("false"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const loginAttempts = pgTable("login_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  ipAddress: text("ip_address").notNull(),
  successful: text("successful").notNull(),
  attemptedAt: timestamp("attempted_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
}).extend({
  email: z.string().email().refine((email) => email.endsWith("@eil.com"), {
    message: "Email must be from the company domain (@eil.com)",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["management", "employee", "trainee"]),
});

export const loginSchema = z.object({
  userId: z.string().min(1, "User ID or email is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["management", "employee", "trainee"]),
  rememberMe: z.boolean().optional(),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email().refine((email) => email.endsWith("@eil.com"), {
    message: "Email must be from the company domain (@eil.com)",
  }),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type PasswordResetRecord = typeof passwordResets.$inferSelect;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
