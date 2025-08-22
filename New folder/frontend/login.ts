import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  userId: text("user_id").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(), // 'management' | 'employee' | 'trainee'
  department: text("department").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  userId: true,
  password: true,
  type: true,
  department: true,
});

export const loginSchema = z.object({
  loginType: z.enum(["management", "employee", "trainee"]),
  userId: z.string().min(1, "User ID or email is required"),
  password: z.string().min(1, "Password is required"),
  recaptcha: z.string().min(1, "reCAPTCHA is required"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .refine(
      (email) => email.endsWith("@eil.com"),
      "Email must be a company email (@eil.com)",
    ),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
