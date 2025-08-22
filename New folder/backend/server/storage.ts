import { users, passwordResets, loginAttempts, type User, type InsertUser, type PasswordResetRecord, type LoginAttempt } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  createPasswordReset(email: string, token: string, expiresAt: Date): Promise<void>;
  getPasswordReset(token: string): Promise<PasswordResetRecord | undefined>;
  markPasswordResetAsUsed(id: string): Promise<void>;
  logLoginAttempt(email: string, ipAddress: string, successful: boolean): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: "user_sessions"
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id));
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  async createPasswordReset(email: string, token: string, expiresAt: Date): Promise<void> {
    await db
      .insert(passwordResets)
      .values({
        email,
        token,
        expiresAt,
        used: "false"
      });
  }

  async getPasswordReset(token: string): Promise<PasswordResetRecord | undefined> {
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.token, token));
    return reset || undefined;
  }

  async markPasswordResetAsUsed(id: string): Promise<void> {
    await db
      .update(passwordResets)
      .set({ used: "true" })
      .where(eq(passwordResets.id, id));
  }

  async logLoginAttempt(email: string, ipAddress: string, successful: boolean): Promise<void> {
    await db
      .insert(loginAttempts)
      .values({
        email,
        ipAddress,
        successful: successful ? "true" : "false"
      });
  }
}

export const storage = new DatabaseStorage();
