import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminPage from "@/pages/admin-page";
import SetupPage from "@/pages/setup-page";
import { useQuery } from "@tanstack/react-query";
import { ConfigType } from "@/types";
import { useEffect, useState } from "react";

// Analytics component to track page views
function Analytics() {
  const [location] = useLocation();
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });
  
  useEffect(() => {
    // Don't track admin page visits
    if (location.startsWith("/admin")) {
      return;
    }
    
    // Track page views and send to Discord webhook if configured
    if (config?.webhooks?.discord) {
      try {
        fetch(config.webhooks.discord, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `New page view: ${location} at ${new Date().toISOString()}`,
            username: 'Website Analytics',
          }),
        });
      } catch (error) {
        console.error('Failed to send to Discord webhook:', error);
      }
    }
  }, [location, config]);
  
  return null;
}

// SetupChecker component to handle setup redirects
function SetupChecker() {
  const [, setLocation] = useLocation();
  const [setupChecked, setSetupChecked] = useState(false);
  
  const { data: setupStatus } = useQuery({
    queryKey: ["/api/setup/status"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/setup/status");
        if (!res.ok) return { isFirstTime: false, isComplete: true };
        return res.json();
      } catch (error) {
        console.error("Error checking setup status:", error);
        return { isFirstTime: false, isComplete: true };
      }
    },
    retry: false,
    staleTime: Infinity
  });
  
  useEffect(() => {
    if (setupStatus) {
      setSetupChecked(true);
      // If this is a first-time setup and not complete, redirect to setup page
      if (setupStatus.isFirstTime && !setupStatus.isComplete) {
        setLocation("/setup");
      }
    }
  }, [setupStatus, setLocation]);
  
  return null;
}

// Main router component
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/setup" component={SetupPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main app component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <SetupChecker />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
