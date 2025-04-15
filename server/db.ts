import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { 
  ConfigType, 
  ProfileType, 
  NavigationItemType, 
  SocialLinkType, 
  ProjectsType, 
  ProjectItemType, 
  QuickLinkType, 
  FormFieldType, 
  ContactType, 
  WebhooksType,
  DiscoverType,
  DiscoverSectionType,
  DiscoverItemType,
  PerformanceSettingsType
} from '../shared/schema';

// Ensure the data directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to the SQLite database (will be created if it doesn't exist)
const db = new Database(path.join(dbDir, 'qwit.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Function to check if this is a first-time setup
function checkFirstTimeSetup(): boolean {
  try {
    const tablesExist = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    const setupComplete = isSetupComplete();
    return Boolean(tablesExist) && !setupComplete;
  } catch (error) {
    console.error("Error checking first time setup:", error);
    return false;
  }
}

// Create tables if they don't exist
function initDatabase() {
  // Tables are created as needed

  // Create users table for admin login
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create setup_complete table to track installation status
  db.exec(`
    CREATE TABLE IF NOT EXISTS setup_complete (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      completed BOOLEAN DEFAULT 0,
      completed_at DATETIME
    )
  `);

  // Create profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      avatar TEXT NOT NULL,
      banner TEXT NOT NULL,
      verified BOOLEAN DEFAULT 0,
      bio TEXT,
      status TEXT
    )
  `);

  // Create navigation table
  db.exec(`
    CREATE TABLE IF NOT EXISTS navigation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      active BOOLEAN DEFAULT 0,
      display_order INTEGER NOT NULL
    )
  `);

  // Create social links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      action TEXT NOT NULL
    )
  `);

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT
    )
  `);

  // Create project items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      url TEXT NOT NULL,
      project_id INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    )
  `);

  // Create quick links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quick_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL
    )
  `);

  // Create contact settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      button_text TEXT NOT NULL,
      title TEXT NOT NULL,
      submit_button TEXT NOT NULL,
      cancel_button TEXT NOT NULL,
      contact_url TEXT
    )
  `);

  // Create contact form fields table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      required BOOLEAN DEFAULT 0,
      FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE
    )
  `);

  // Create webhooks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord TEXT
    )
  `);
  
  // Create owner settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS owner_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT
    )
  `);
  
  // Add loading_letter column if it doesn't exist
  try {
    db.prepare("SELECT loading_letter FROM owner_settings LIMIT 1").get();
  } catch (e) {
    console.log("Adding loading_letter column to owner_settings table");
    db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_letter TEXT DEFAULT 'H'`);
  }
  
  // Add loading_text column if it doesn't exist
  try {
    db.prepare("SELECT loading_text FROM owner_settings LIMIT 1").get();
  } catch (e) {
    console.log("Adding loading_text column to owner_settings table");
    db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_text TEXT DEFAULT 'Loading...'`);
  }
  
  // Create discover table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discover (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT
    )
  `);
  
  // Create discover sections table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discover_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      discover_id INTEGER NOT NULL,
      FOREIGN KEY (discover_id) REFERENCES discover (id) ON DELETE CASCADE
    )
  `);
  
  // Create discover items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discover_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      url TEXT,
      tag TEXT,
      section_id INTEGER NOT NULL,
      FOREIGN KEY (section_id) REFERENCES discover_sections (id) ON DELETE CASCADE
    )
  `);
  
  // Create discover stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discover_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discover_id INTEGER NOT NULL,
      show_stats BOOLEAN DEFAULT 1,
      experience_years INTEGER,
      FOREIGN KEY (discover_id) REFERENCES discover (id) ON DELETE CASCADE
    )
  `);
  
  // Create discover custom stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS discover_custom_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      stats_id INTEGER NOT NULL,
      FOREIGN KEY (stats_id) REFERENCES discover_stats (id) ON DELETE CASCADE
    )
  `);
  
  // Create performance settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS performance_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_optimization BOOLEAN DEFAULT 0,
      analytics BOOLEAN DEFAULT 0
    )
  `);
  
  // Create theme settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS theme_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      primary_color TEXT DEFAULT '#3B82F6',
      background_color TEXT DEFAULT '#111827',
      text_color TEXT DEFAULT '#F9FAFB',
      accent_color TEXT DEFAULT '#6366F1',
      font_family TEXT DEFAULT 'Inter',
      border_radius INTEGER DEFAULT 8,
      enable_animations BOOLEAN DEFAULT 1
    )
  `);

  // Check if setup has been completed
  const setupCheck = db.prepare('SELECT * FROM setup_complete WHERE completed = 1 LIMIT 1').get();
  
  // If setup is already completed, we don't need to insert default data
  if (setupCheck) {
    return;
  }

  // For first-time setup, insert a default admin user (this will be changed during setup)
  const adminCheck = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminCheck) {
    // Default password is 'admin' - users will change this during setup
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', 'admin');
  }

  // Insert default profile data if not exists
  const profileCheck = db.prepare('SELECT * FROM profile LIMIT 1').get();
  if (!profileCheck) {
    db.prepare(`
      INSERT INTO profile (name, title, avatar, banner, verified, bio, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'John Doe',
      'Full Stack Developer',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1544306094-e2dcf9479da3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      1,
      'watching anime (:\non a vacation',
      'I\'m not currently doing anything!'
    );
  }

  // Insert default navigation items if not exists
  const navCheck = db.prepare('SELECT * FROM navigation LIMIT 1').get();
  if (!navCheck) {
    const navItems = [
      { name: 'User Info', path: 'user-info', active: 1, order: 1 },
      { name: 'Projects', path: 'projects', active: 0, order: 2 },
      { name: 'Socials', path: 'socials', active: 0, order: 3 },
      { name: 'Discover', path: 'discover', active: 0, order: 4 },
      { name: 'Contact', path: 'contact', active: 0, order: 5 }
    ];
    
    const navInsert = db.prepare('INSERT INTO navigation (name, path, active, display_order) VALUES (?, ?, ?, ?)');
    navItems.forEach(item => {
      navInsert.run(item.name, item.path, item.active, item.order);
    });
  }

  // Insert default social links if not exists
  const socialCheck = db.prepare('SELECT * FROM social_links LIMIT 1').get();
  if (!socialCheck) {
    const socialLinks = [
      { name: 'Gmail', username: 'johndoe@gmail.com', url: 'mailto:johndoe@gmail.com', icon: 'email', action: 'copy' },
      { name: 'Facebook', username: 'John Doe', url: 'https://facebook.com/johndoe', icon: 'facebook', action: 'view' },
      { name: 'Instagram', username: '@johndoe', url: 'https://instagram.com/johndoe', icon: 'instagram', action: 'view' },
      { name: 'YouTube', username: '@johndoe', url: 'https://youtube.com/c/johndoe', icon: 'youtube', action: 'view' },
      { name: 'Discord', username: '@johndoe', url: 'https://discord.com/users/johndoe', icon: 'discord', action: 'view' },
      { name: 'Spotify', username: 'John Doe', url: 'https://open.spotify.com/user/johndoe', icon: 'spotify', action: 'view' }
    ];
    
    const socialInsert = db.prepare('INSERT INTO social_links (name, username, url, icon, action) VALUES (?, ?, ?, ?, ?)');
    socialLinks.forEach(link => {
      socialInsert.run(link.name, link.username, link.url, link.icon, link.action);
    });
  }

  // Insert default projects if not exists
  const projectsCheck = db.prepare('SELECT * FROM projects LIMIT 1').get();
  if (!projectsCheck) {
    const projectId = db.prepare('INSERT INTO projects (title, description) VALUES (?, ?)')
      .run('Projects/Work Place', 'Some Public projects only').lastInsertRowid;

    const projectItems = [
      { name: 'Amar World', icon: '/assets/icons/project1.png', url: '#' },
      { name: 'RAMIAKINSWOME', icon: '/assets/icons/project2.png', url: '#' },
      { name: 'LAYLUX', icon: '/assets/icons/project3.png', url: '#' },
      { name: 'RAKIN DEV', icon: '/assets/icons/project4.png', url: '#' }
    ];
    
    const projectItemInsert = db.prepare('INSERT INTO project_items (name, icon, url, project_id) VALUES (?, ?, ?, ?)');
    projectItems.forEach(item => {
      projectItemInsert.run(item.name, item.icon, item.url, projectId);
    });
  }

  // Insert default quick links if not exists
  const quickLinksCheck = db.prepare('SELECT * FROM quick_links LIMIT 1').get();
  if (!quickLinksCheck) {
    const quickLinks = [
      { name: 'Youtube', url: 'https://youtube.com/c/johndoe' },
      { name: 'Discord', url: 'https://discord.com/users/johndoe' },
      { name: 'Instagram', url: 'https://instagram.com/johndoe' }
    ];
    
    const quickLinkInsert = db.prepare('INSERT INTO quick_links (name, url) VALUES (?, ?)');
    quickLinks.forEach(link => {
      quickLinkInsert.run(link.name, link.url);
    });
  }

  // Insert default contact settings if not exists
  const contactCheck = db.prepare('SELECT * FROM contact LIMIT 1').get();
  if (!contactCheck) {
    const contactId = db.prepare('INSERT INTO contact (button_text, title, submit_button, cancel_button) VALUES (?, ?, ?, ?)')
      .run('Contact', 'Contact With Me', 'Send message', 'cancel').lastInsertRowid;

    const contactFields = [
      { type: 'text', label: 'Username', required: 1 },
      { type: 'text', label: 'Discord username:', required: 0 },
      { type: 'email', label: 'Email:', required: 1 },
      { type: 'textarea', label: 'Message:', required: 1 }
    ];
    
    const fieldInsert = db.prepare('INSERT INTO contact_fields (contact_id, type, label, required) VALUES (?, ?, ?, ?)');
    contactFields.forEach(field => {
      fieldInsert.run(contactId, field.type, field.label, field.required);
    });
  }

  // Insert default webhook if not exists
  const webhookCheck = db.prepare('SELECT * FROM webhooks LIMIT 1').get();
  if (!webhookCheck) {
    db.prepare('INSERT INTO webhooks (discord) VALUES (?)')
      .run('https://discord.com/api/webhooks/your-webhook-url-here');
  }
  
  // Insert default owner settings if not exists
  const ownerSettingsCheck = db.prepare('SELECT * FROM owner_settings LIMIT 1').get();
  if (!ownerSettingsCheck) {
    db.prepare('INSERT INTO owner_settings (id, email, loading_letter) VALUES (?, ?, ?)')
      .run(1, 'owner@example.com', 'H');
  }
}

// Initialize the database
initDatabase();

// Get complete config from database
function getConfig(): ConfigType {
  const profileData = db.prepare('SELECT * FROM profile LIMIT 1').get() as any;
  const profile: ProfileType = {
    id: profileData.id,
    name: profileData.name,
    title: profileData.title,
    avatar: profileData.avatar,
    banner: profileData.banner,
    verified: Boolean(profileData.verified),
    bio: profileData.bio,
    status: profileData.status
  };
  
  const navigationData = db.prepare('SELECT id, name, path, active FROM navigation ORDER BY display_order').all() as any[];
  const navigation: NavigationItemType[] = navigationData.map(item => ({
    id: item.id,
    name: item.name,
    path: item.path,
    active: Boolean(item.active)
  }));
  
  const socialLinksData = db.prepare('SELECT id, name, username, url, icon, action FROM social_links').all() as any[];
  const socialLinks: SocialLinkType[] = socialLinksData.map(link => ({
    id: link.id,
    name: link.name,
    username: link.username,
    url: link.url,
    icon: link.icon,
    action: link.action
  }));
  
  const projectsData = db.prepare('SELECT * FROM projects LIMIT 1').get() as any;
  const projectItemsData = db.prepare('SELECT name, icon, url FROM project_items WHERE project_id = ?').all(projectsData.id) as any[];
  const projects: ProjectsType = {
    id: projectsData.id,
    title: projectsData.title,
    description: projectsData.description,
    items: projectItemsData.map(item => ({
      name: item.name,
      icon: item.icon,
      url: item.url
    }))
  };
  
  const quickLinksData = db.prepare('SELECT name, url FROM quick_links').all() as any[];
  const quickLinks: QuickLinkType[] = quickLinksData.map(link => ({
    name: link.name,
    url: link.url
  }));
  
  const contactData = db.prepare('SELECT * FROM contact LIMIT 1').get() as any;
  const formFieldsData = db.prepare('SELECT type, label, required FROM contact_fields WHERE contact_id = ?').all(contactData.id) as any[];
  const contact: ContactType = {
    buttonText: contactData.button_text,
    title: contactData.title,
    formFields: formFieldsData.map(field => ({
      type: field.type as "text" | "email" | "textarea",
      label: field.label,
      required: Boolean(field.required)
    })),
    submitButton: contactData.submit_button,
    cancelButton: contactData.cancel_button,
    contactUrl: contactData.contact_url || undefined
  };
  
  const webhooksData = db.prepare('SELECT discord FROM webhooks LIMIT 1').get() as any;
  const webhooks: WebhooksType = {
    discord: webhooksData.discord
  };
  
  // Get owner settings
  const ownerEmail = getOwnerEmail();
  // Try to get loading letter, if it fails, use a default value
  let loadingLetter = "H";
  try {
    loadingLetter = getLoadingLetter();
  } catch (e) {
    console.log("Could not get loading letter, using default value 'H'");
    // Try to add the column for future requests
    try {
      db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_letter TEXT DEFAULT 'H'`);
    } catch (alterError) {
      console.error("Failed to add loading_letter column:", alterError);
    }
  }
  
  // Try to get loading text
  let loadingText = "Loading...";
  try {
    const loadingTextResult = db.prepare('SELECT loading_text FROM owner_settings WHERE id = 1').get() as any;
    if (loadingTextResult && loadingTextResult.loading_text) {
      loadingText = loadingTextResult.loading_text;
    }
  } catch (e) {
    console.log("Could not get loading text, using default value 'Loading...'");
    // Try to add the column for future requests
    try {
      db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_text TEXT DEFAULT 'Loading...'`);
    } catch (alterError) {
      console.error("Failed to add loading_text column:", alterError);
    }
  }
  
  const ownerSettings = {
    email: ownerEmail,
    loadingLetter: loadingLetter,
    loadingText: loadingText
  };
  
  // Try to get discover data
  let discover: DiscoverType | undefined = undefined;
  try {
    const discoverData = db.prepare('SELECT * FROM discover LIMIT 1').get() as any;
    if (discoverData) {
      const discoverSections = db.prepare('SELECT * FROM discover_sections WHERE discover_id = ?').all(discoverData.id) as any[];
      
      const sections = discoverSections.map((section: any) => {
        const sectionItems = db.prepare('SELECT * FROM discover_items WHERE section_id = ?').all(section.id) as any[];
        return {
          id: section.id,
          title: section.title,
          description: section.description,
          items: sectionItems.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
            url: item.url,
            tag: item.tag
          }))
        };
      });
      
      const statsData = db.prepare('SELECT * FROM discover_stats WHERE discover_id = ?').get(discoverData.id) as any;
      let stats: any = undefined;
      
      if (statsData) {
        const customStats = db.prepare('SELECT * FROM discover_custom_stats WHERE stats_id = ?').all(statsData.id) as any[];
        stats = {
          showStats: Boolean(statsData.show_stats),
          experienceYears: statsData.experience_years,
          customStats: customStats.map((stat: any) => ({
            label: stat.label,
            value: stat.value
          }))
        };
      }
      
      discover = {
        title: discoverData.title,
        description: discoverData.description,
        sections,
        stats
      };
    }
  } catch (e) {
    console.error("Error getting discover data:", e);
  }
  
  // Try to get performance settings
  let performanceSettings: PerformanceSettingsType | undefined = undefined;
  try {
    const perfData = db.prepare('SELECT * FROM performance_settings LIMIT 1').get() as any;
    if (perfData) {
      performanceSettings = {
        imageOptimization: Boolean(perfData.image_optimization),
        analytics: Boolean(perfData.analytics)
      };
    }
  } catch (e) {
    console.error("Error getting performance settings:", e);
  }

  return {
    profile,
    navigation,
    socialLinks,
    projects,
    quickLinks,
    contact,
    webhooks,
    ownerSettings,
    discover,
    performanceSettings
  };
}

// Update profile
function updateProfile(profileData: any) {
  return db.prepare(`
    UPDATE profile SET 
      name = ?, 
      title = ?, 
      avatar = ?, 
      banner = ?, 
      verified = ?, 
      bio = ?, 
      status = ?
    WHERE id = ?
  `).run(
    profileData.name,
    profileData.title,
    profileData.avatar,
    profileData.banner,
    profileData.verified ? 1 : 0,
    profileData.bio,
    profileData.status,
    profileData.id
  );
}

// Verify user credentials for admin login
function verifyCredentials(username: string, password: string) {
  // First, get the user by username only
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as { password: string } | undefined;
  
  // If user exists, check password
  if (user) {
    // For now we're using plain text passwords, but this should be replaced with proper hashing
    return user.password === password;
  }
  
  return false;
}

// Update user password
function updatePassword(userId: number, newPassword: string) {
  // Should use a proper password hashing function in a production environment
  return db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
}

// Update webhook url
function updateWebhook(discord: string) {
  return db.prepare('UPDATE webhooks SET discord = ? WHERE id = 1').run(discord);
}

// Update contact URL
function updateContactUrl(contactUrl: string) {
  return db.prepare('UPDATE contact SET contact_url = ? WHERE id = 1').run(contactUrl);
}

// Get owner's email
function getOwnerEmail(): string {
  const result = db.prepare('SELECT email FROM owner_settings WHERE id = 1').get() as any;
  return result && result.email ? result.email : '';
}

// Get loading letter
function getLoadingLetter(): string {
  try {
    const result = db.prepare('SELECT loading_letter FROM owner_settings WHERE id = 1').get() as any;
    return result && result.loading_letter ? result.loading_letter : 'H';
  } catch (error) {
    console.error("Error getting loading letter:", error);
    return 'H'; // Default fallback letter
  }
}

// Get loading text
function getLoadingText(): string {
  try {
    const result = db.prepare('SELECT loading_text FROM owner_settings WHERE id = 1').get() as any;
    return result && result.loading_text ? result.loading_text : 'Loading...';
  } catch (error) {
    console.error("Error getting loading text:", error);
    return 'Loading...'; // Default fallback text
  }
}

// Update owner's email
function updateOwnerEmail(email: string) {
  // First check if record exists
  const record = db.prepare('SELECT * FROM owner_settings WHERE id = 1').get();
  
  if (record) {
    // Update existing record
    return db.prepare('UPDATE owner_settings SET email = ? WHERE id = 1').run(email);
  } else {
    // Insert new record if it doesn't exist
    return db.prepare('INSERT INTO owner_settings (id, email) VALUES (?, ?)').run(1, email);
  }
}

// Update loading letter
function updateLoadingLetter(letter: string) {
  try {
    // First check if record exists
    const record = db.prepare('SELECT * FROM owner_settings WHERE id = 1').get();
    
    if (record) {
      // Update existing record
      try {
        // First try with the new column
        return db.prepare('UPDATE owner_settings SET loading_letter = ? WHERE id = 1').run(letter);
      } catch (columnError) {
        console.error("Error updating loading letter, column might not exist:", columnError);
        // If column doesn't exist, try to add it
        try {
          db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_letter TEXT DEFAULT 'H'`);
          // Then try again
          return db.prepare('UPDATE owner_settings SET loading_letter = ? WHERE id = 1').run(letter);
        } catch (alterError) {
          console.error("Failed to add loading_letter column:", alterError);
          throw alterError;
        }
      }
    } else {
      // Insert new record if it doesn't exist
      return db.prepare('INSERT INTO owner_settings (id, email, loading_letter) VALUES (?, ?, ?)').run(1, "", letter);
    }
  } catch (error) {
    console.error("Error in updateLoadingLetter:", error);
    throw error;
  }
}

// Update loading text
function updateLoadingText(text: string) {
  try {
    // First check if record exists
    const record = db.prepare('SELECT * FROM owner_settings WHERE id = 1').get();
    
    if (record) {
      // Update existing record
      try {
        // First try with the new column
        return db.prepare('UPDATE owner_settings SET loading_text = ? WHERE id = 1').run(text);
      } catch (columnError) {
        console.error("Error updating loading text, column might not exist:", columnError);
        // If column doesn't exist, try to add it
        try {
          db.exec(`ALTER TABLE owner_settings ADD COLUMN loading_text TEXT DEFAULT 'Loading...'`);
          // Then try again
          return db.prepare('UPDATE owner_settings SET loading_text = ? WHERE id = 1').run(text);
        } catch (alterError) {
          console.error("Failed to add loading_text column:", alterError);
          throw alterError;
        }
      }
    } else {
      // Insert new record if it doesn't exist
      return db.prepare('INSERT INTO owner_settings (id, email, loading_text) VALUES (?, ?, ?)').run(1, "", text);
    }
  } catch (error) {
    console.error("Error in updateLoadingText:", error);
    throw error;
  }
}

// Check if setup has been completed
function isSetupComplete(): boolean {
  const setupCheck = db.prepare('SELECT * FROM setup_complete WHERE completed = 1 LIMIT 1').get();
  return setupCheck ? true : false;
}

// Complete the setup process
function completeSetup(): void {
  try {
    const currentTime = new Date().toISOString();
    db.prepare('INSERT INTO setup_complete (completed, completed_at) VALUES (?, ?)').run(1, currentTime);
  } catch (error) {
    console.error("Error in completeSetup:", error);
    throw error;
  }
}

// Create admin user during setup
function createAdminUser(username: string, password: string): void {
  // First, clear any existing users
  db.prepare('DELETE FROM users').run();
  
  // Then create the new admin user
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
}

// Update or create social link
function updateSocialLink(socialData: any) {
  // If id is 0 or not provided, this is a new social link
  if (!socialData.id || socialData.id === 0) {
    return db.prepare(`
      INSERT INTO social_links (name, username, url, icon, action)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      socialData.name,
      socialData.username,
      socialData.url,
      socialData.icon,
      socialData.action
    );
  } else {
    // This is an update to an existing social link
    return db.prepare(`
      UPDATE social_links SET 
        name = ?, 
        username = ?, 
        url = ?, 
        icon = ?, 
        action = ?
      WHERE id = ?
    `).run(
      socialData.name,
      socialData.username,
      socialData.url,
      socialData.icon,
      socialData.action,
      socialData.id
    );
  }
}

// Update project
function updateProject(projectData: any) {
  // First update the project title and description
  db.prepare(`
    UPDATE projects SET 
      title = ?, 
      description = ?
    WHERE id = ?
  `).run(
    projectData.title,
    projectData.description,
    projectData.id
  );

  // Handle project items
  if (projectData.items && Array.isArray(projectData.items)) {
    // We'll replace all items with new ones
    // First, delete existing items for this project
    db.prepare('DELETE FROM project_items WHERE project_id = ?').run(projectData.id);
    
    // Then insert the new ones
    const insertStmt = db.prepare('INSERT INTO project_items (name, icon, url, project_id) VALUES (?, ?, ?, ?)');
    projectData.items.forEach((item: ProjectItemType) => {
      insertStmt.run(item.name, item.icon, item.url, projectData.id);
    });
  }
  
  return { success: true };
}

// Update quick links
function updateQuickLinks(quickLinks: QuickLinkType[]) {
  // Delete all existing quick links
  db.prepare('DELETE FROM quick_links').run();
  
  // Insert the new quick links
  const insertStmt = db.prepare('INSERT INTO quick_links (name, url) VALUES (?, ?)');
  quickLinks.forEach((link: QuickLinkType) => {
    insertStmt.run(link.name, link.url);
  });
  
  return { success: true };
}

// Update navigation
function updateNavigation(navigation: NavigationItemType[]) {
  // Start a transaction
  db.prepare('BEGIN TRANSACTION').run();
  
  try {
    // Update each navigation item
    const updateStmt = db.prepare(`
      UPDATE navigation SET 
        name = ?, 
        path = ?,
        active = ?,
        display_order = ?
      WHERE id = ?
    `);

    navigation.forEach((item: NavigationItemType, index: number) => {
      updateStmt.run(
        item.name,
        item.path,
        item.active ? 1 : 0,
        index + 1, // Use the array index + 1 for display_order
        item.id
      );
    });
    
    // Commit the transaction
    db.prepare('COMMIT').run();
    return { success: true };
  } catch (error) {
    // Rollback in case of error
    db.prepare('ROLLBACK').run();
    console.error('Error updating navigation:', error);
    throw error;
  }
}

function getDb() {
  return db;
}

// Add/Update discover content
export function updateFormFields(formFields: any[]) {
  const db = getDb();
  
  db.prepare('BEGIN TRANSACTION').run();
  
  try {
    // Delete existing form fields
    db.prepare('DELETE FROM contact_fields').run();
    
    // Insert updated form fields
    if (formFields && formFields.length > 0) {
      const fieldInsert = db.prepare(`
        INSERT INTO contact_fields (contact_id, type, label, required, display_order)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      formFields.forEach((field, index) => {
        fieldInsert.run(
          1, // contact_id is always 1
          field.type,
          field.label,
          field.required ? 1 : 0,
          index
        );
      });
    }
    
    db.prepare('COMMIT').run();
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
}

function updateDiscover(discoverData: DiscoverType) {
  // Start a transaction
  db.prepare('BEGIN TRANSACTION').run();
  
  try {
    // Check if discover exists
    const existingDiscover = db.prepare('SELECT * FROM discover LIMIT 1').get() as any;
    let discoverID: number;
    
    if (existingDiscover) {
      // Update existing discover
      db.prepare('UPDATE discover SET title = ?, description = ? WHERE id = ?')
        .run(discoverData.title, discoverData.description || null, existingDiscover.id);
      discoverID = existingDiscover.id;
    } else {
      // Insert new discover
      const result = db.prepare('INSERT INTO discover (title, description) VALUES (?, ?)')
        .run(discoverData.title, discoverData.description || null);
      discoverID = Number(result.lastInsertRowid);
    }
    
    // Clear existing sections and items
    const existingSections = db.prepare('SELECT id FROM discover_sections WHERE discover_id = ?').all(discoverID) as any[];
    for (const section of existingSections) {
      db.prepare('DELETE FROM discover_items WHERE section_id = ?').run(section.id);
    }
    db.prepare('DELETE FROM discover_sections WHERE discover_id = ?').run(discoverID);
    
    // Add new sections and items
    if (discoverData.sections && Array.isArray(discoverData.sections)) {
      for (const section of discoverData.sections) {
        const sectionResult = db.prepare('INSERT INTO discover_sections (title, description, discover_id) VALUES (?, ?, ?)')
          .run(section.title, section.description || null, discoverID);
        const sectionID = Number(sectionResult.lastInsertRowid);
        
        // Add items for this section
        if (section.items && Array.isArray(section.items)) {
          for (const item of section.items) {
            db.prepare('INSERT INTO discover_items (title, description, image, url, tag, section_id) VALUES (?, ?, ?, ?, ?, ?)')
              .run(
                item.title, 
                item.description, 
                item.image || null, 
                item.url || null, 
                item.tag || null, 
                sectionID
              );
          }
        }
      }
    }
    
    // Handle stats
    if (discoverData.stats) {
      // Delete existing stats
      const existingStats = db.prepare('SELECT id FROM discover_stats WHERE discover_id = ?').get(discoverID) as any;
      if (existingStats) {
        db.prepare('DELETE FROM discover_custom_stats WHERE stats_id = ?').run(existingStats.id);
        db.prepare('DELETE FROM discover_stats WHERE id = ?').run(existingStats.id);
      }
      
      // Insert new stats
      const statsResult = db.prepare('INSERT INTO discover_stats (discover_id, show_stats, experience_years) VALUES (?, ?, ?)')
        .run(
          discoverID, 
          discoverData.stats.showStats ? 1 : 0, 
          discoverData.stats.experienceYears || null
        );
      const statsID = Number(statsResult.lastInsertRowid);
      
      // Insert custom stats
      if (discoverData.stats.customStats && Array.isArray(discoverData.stats.customStats)) {
        for (const stat of discoverData.stats.customStats) {
          db.prepare('INSERT INTO discover_custom_stats (label, value, stats_id) VALUES (?, ?, ?)')
            .run(stat.label, stat.value, statsID);
        }
      }
    }
    
    // Commit transaction
    db.prepare('COMMIT').run();
    return { success: true };
  } catch (error) {
    // Rollback in case of error
    db.prepare('ROLLBACK').run();
    console.error('Error updating discover:', error);
    throw error;
  }
}

// Update performance settings
function updatePerformanceSettings(settings: PerformanceSettingsType) {
  // Check if performance settings exist
  const existingSettings = db.prepare('SELECT * FROM performance_settings LIMIT 1').get() as any;
  
  if (existingSettings) {
    // Update existing settings
    return db.prepare('UPDATE performance_settings SET image_optimization = ?, analytics = ? WHERE id = ?')
      .run(
        settings.imageOptimization ? 1 : 0, 
        settings.analytics ? 1 : 0, 
        existingSettings.id
      );
  } else {
    // Insert new settings
    return db.prepare('INSERT INTO performance_settings (image_optimization, analytics) VALUES (?, ?)')
      .run(settings.imageOptimization ? 1 : 0, settings.analytics ? 1 : 0);
  }
}

// Update theme settings
function updateThemeSettings(settings: any) {
  // Check if theme settings exist
  const existingSettings = db.prepare('SELECT * FROM theme_settings LIMIT 1').get() as any;
  
  if (existingSettings) {
    // Update existing settings
    return db.prepare(`
      UPDATE theme_settings SET 
        primary_color = ?, 
        background_color = ?, 
        text_color = ?, 
        accent_color = ?,
        font_family = ?,
        border_radius = ?,
        enable_animations = ?
      WHERE id = ?
    `).run(
      settings.primaryColor,
      settings.backgroundColor,
      settings.textColor,
      settings.accentColor,
      settings.fontFamily,
      settings.borderRadius,
      settings.enableAnimations ? 1 : 0,
      existingSettings.id
    );
  } else {
    // Insert new settings
    return db.prepare(`
      INSERT INTO theme_settings (
        primary_color, 
        background_color, 
        text_color, 
        accent_color,
        font_family,
        border_radius,
        enable_animations
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      settings.primaryColor,
      settings.backgroundColor,
      settings.textColor,
      settings.accentColor,
      settings.fontFamily,
      settings.borderRadius,
      settings.enableAnimations ? 1 : 0
    );
  }
}

export {
  db,
  getDb,
  getConfig,
  updateProfile,
  verifyCredentials,
  updatePassword,
  updateWebhook,
  updateContactUrl,
  getOwnerEmail,
  updateOwnerEmail,
  getLoadingLetter,
  getLoadingText,
  updateLoadingLetter,
  updateLoadingText,
  updateSocialLink,
  updateProject,
  updateQuickLinks,
  updateNavigation,
  updateDiscover,
  updatePerformanceSettings,
  updateThemeSettings,
  checkFirstTimeSetup,
  isSetupComplete,
  completeSetup,
  createAdminUser
};