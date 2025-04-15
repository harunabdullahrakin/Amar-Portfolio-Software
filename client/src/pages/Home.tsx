import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ConfigType } from "@/types";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import UserInfo from "@/components/UserInfo";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import Discover from "@/components/Discover";
import Contact from "@/components/Contact";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [activePage, setActivePage] = useState("user-info");
  const [loading, setLoading] = useState(true);

  // Fetch config from API
  const { 
    data: config, 
    isLoading, 
    error 
  } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  // Handle navigation
  useEffect(() => {
    // Get hash from URL (remove the # symbol)
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActivePage(hash);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) {
        setActivePage(newHash);
      } else {
        setActivePage("user-info"); // Default to user info
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle initial loading animation
  useEffect(() => {
    // Show loading animation for at least 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading UI while fetching data
  if (isLoading || loading) {
    return <LoadingScreen />;
  }

  // Show error if config can't be loaded
  if (error || !config) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md mx-4 p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load configuration. Please check if config.json is present.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Render the appropriate component based on active page
  const renderActivePage = () => {
    switch (activePage) {
      case "user-info":
        return <UserInfo />;
      case "projects":
        return <Projects />;
      case "socials":
        return <Socials />;
      case "discover":
        return <Discover />;
      case "contact":
        return <Contact />;
      default:
        return <UserInfo />;
    }
  };

  // Main layout with content
  return (
    <Layout activePage={activePage}>
      {renderActivePage()}
    </Layout>
  );
}
