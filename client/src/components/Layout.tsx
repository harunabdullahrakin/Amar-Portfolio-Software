import { useQuery } from "@tanstack/react-query";
import { ConfigType, NavigationItemType } from "@/types";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export default function Layout({ children, activePage }: LayoutProps) {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Contact form is not used anymore - using direct links instead

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  if (!config) return null;

  const handleContactAction = () => {
    // Always use the contact URL if provided, otherwise default to mailto link
    const url = config.contact.contactUrl || 'mailto:contact@example.com';
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900">
      {/* Centered container with responsive width */}
      <div className="w-full max-w-screen-sm md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto pb-16 shadow-xl bg-white dark:bg-gray-800 transition-all">
        {/* Banner image with theme switcher */}
        <div
          className="banner relative w-full"
          style={{ backgroundImage: `url(${config.profile.banner})` }}
        >
          <div className="absolute top-4 right-4">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Profile info */}
        <div className="profile-container">
          <img
            src={config.profile.avatar}
            alt={config.profile.name}
            className="avatar"
          />
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-xl font-bold flex items-center">
                {config.profile.name}
                {config.profile.verified && (
                  <span 
                    className="ml-1 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs" 
                    title="Verified"
                    style={{
                      background: 'linear-gradient(45deg, #4267B2, #1877F2)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="5 12 10 17 19 8"></polyline>
                    </svg>
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{config.profile.title}</p>
            </div>
            <button 
              className="primary-button"
              onClick={handleContactAction}
            >
              {config.contact.buttonText}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-container overflow-x-auto">
          {config.navigation.map((item: NavigationItemType) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className={`nav-item ${item.path === activePage || (activePage === "" && item.path === "user-info") ? "active" : ""}`}
            >
              {item.name}
            </a>
          ))}
          <a 
            href="/admin"
            className={`nav-item login-item ${activePage === "admin" || activePage === "login" ? "active" : ""}`}
          >
            {isAuthenticated ? "Manage" : "Login"}
          </a>
        </nav>

        {/* Main content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}