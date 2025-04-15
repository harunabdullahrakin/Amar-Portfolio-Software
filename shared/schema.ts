import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Additional types for our application
export interface ProfileType {
  id: number;
  name: string;
  title: string;
  avatar: string;
  banner: string;
  verified: boolean;
  bio: string;
  status: string;
}

export interface NavigationItemType {
  id: number;
  name: string;
  path: string;
  active: boolean;
}

export interface SocialLinkType {
  id: number;
  name: string;
  username: string;
  url: string;
  icon: string;
  action: string;
}

export interface ProjectItemType {
  name: string;
  icon: string;
  url: string;
}

export interface ProjectsType {
  id: number;
  title: string;
  description: string;
  items: ProjectItemType[];
}

export interface QuickLinkType {
  name: string;
  url: string;
}

export interface FormFieldType {
  type: string;
  label: string;
  required: boolean;
}

export interface ContactType {
  buttonText: string;
  title: string;
  formFields: FormFieldType[];
  submitButton: string;
  cancelButton: string;
  contactUrl?: string; // URL to redirect to when contact button is clicked
}

export interface WebhooksType {
  discord?: string;
}

export interface OwnerSettingsType {
  email: string;
  loadingLetter?: string; // Letter to show on loading screen
  loadingText?: string; // Text to show below the letter on loading screen
}

export interface DiscoverItemType {
  id?: number;
  title: string;
  description: string;
  image?: string;
  url?: string;
  tag?: string;
}

export interface DiscoverSectionType {
  id?: number;
  title: string;
  description?: string;
  items: DiscoverItemType[];
}

export interface DiscoverType {
  title: string;
  description?: string;
  sections: DiscoverSectionType[];
  stats?: {
    showStats: boolean;
    experienceYears?: number;
    customStats?: { label: string; value: string }[];
  };
}

export interface PerformanceSettingsType {
  imageOptimization: boolean;
  analytics: boolean;
}

export interface ConfigType {
  profile: ProfileType;
  navigation: NavigationItemType[];
  socialLinks: SocialLinkType[];
  projects: ProjectsType;
  quickLinks: QuickLinkType[];
  contact: ContactType;
  webhooks?: WebhooksType;
  ownerSettings?: OwnerSettingsType;
  discover?: DiscoverType;
  performanceSettings?: PerformanceSettingsType;
}
