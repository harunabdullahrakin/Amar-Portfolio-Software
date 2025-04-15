export interface ProfileType {
  name: string;
  title: string;
  avatar: string;
  banner: string;
  verified: boolean;
  bio: string;
  status: string;
  location?: string; // Make location optional
}

export interface NavigationItemType {
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
  action: "view" | "copy";
}

export interface ProjectItemType {
  name: string;
  icon: string;
  url: string;
  preview?: string; // Optional preview image URL
}

export interface ProjectsType {
  title: string;
  description: string;
  items: ProjectItemType[];
}

export interface QuickLinkType {
  name: string;
  url: string;
}

export interface FormFieldType {
  type: "text" | "email" | "textarea";
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
  loadingLetter?: string; // Letter displayed on the loading screen
  loadingText?: string; // Text displayed below the letter on loading screen
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
