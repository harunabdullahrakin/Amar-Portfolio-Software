import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [installationKey, setInstallationKey] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if setup is needed
  const { data: setupStatus, isLoading } = useQuery({
    queryKey: ["/api/setup/status"],
    queryFn: async () => {
      const res = await fetch("/api/setup/status");
      if (!res.ok) throw new Error("Failed to fetch setup status");
      return res.json();
    },
  });

  // Redirect if setup is already complete
  useEffect(() => {
    if (setupStatus && setupStatus.isComplete) {
      setLocation("/admin");
    }
  }, [setupStatus, setLocation]);

  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/setup/complete", { 
        username, 
        password,
        installationKey
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Setup complete!",
        description: "You can now login with your new admin credentials.",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Setup failed",
        description: error.message || "There was an error completing the setup",
        variant: "destructive",
      });
    },
  });

  const verifyKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/setup/verify-key", { installationKey });
      return res.json();
    },
    onSuccess: () => {
      setupMutation.mutate();
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid Installation Key",
        description: "The installation key you provided is incorrect. Project files will be deleted.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        apiRequest("POST", "/api/setup/self-delete", {}).then(() => {
          toast({
            title: "Self-Delete Initiated",
            description: "The project files are being deleted due to invalid installation key.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            window.location.href = "about:blank";
          }, 5000);
        });
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    verifyKeyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          First-time Setup
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Welcome to your new website! Please create an admin account to get started.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Admin Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div>
            <label htmlFor="installationKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Installation Key
            </label>
            <input
              id="installationKey"
              type="text"
              value={installationKey}
              onChange={(e) => setInstallationKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter the installation key provided with the software"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              You must enter a valid installation key to proceed. Invalid keys will cause the software to self-delete.
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={setupMutation.isPending || verifyKeyMutation.isPending}
            >
              {setupMutation.isPending || verifyKeyMutation.isPending ? "Verifying and Setting up..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}