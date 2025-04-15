import { useQuery } from "@tanstack/react-query";
import { ConfigType, SocialLinkType } from "@/types";
import { useState } from "react";
// Lucide icons for UI elements
import { 
  Copy, 
  ExternalLink, 
  Check, 
  Globe
} from "lucide-react";

// React Icons for better social media logos
import { 
  FaDiscord, 
  FaFacebookF, 
  FaGithub, 
  FaInstagram, 
  FaLinkedinIn, 
  FaSpotify, 
  FaTwitch,
  FaTwitter, 
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaPinterestP,
  FaRedditAlien,
  FaWhatsapp,
  FaTelegramPlane,
  FaMediumM
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdEmail, MdRssFeed } from "react-icons/md";
import { TbWorld } from "react-icons/tb";

import { useToast } from "@/hooks/use-toast";

export default function Socials() {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!config) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard",
      description: text,
    });
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Map of icon components with improved styling using React Icons
  const iconMap: Record<string, JSX.Element> = {
    // Email services
    email: <MdEmail size={28} className="text-amber-500" />,
    gmail: <SiGmail size={28} className="text-red-500" />,
    
    // Major social networks
    facebook: <FaFacebookF size={24} className="text-blue-600" />,
    instagram: <FaInstagram size={28} className="text-pink-600" />,
    youtube: <FaYoutube size={28} className="text-red-600" />,
    twitter: <FaTwitter size={28} className="text-sky-500" />,
    linkedin: <FaLinkedinIn size={24} className="text-blue-700" />,
    
    // Messaging platforms
    discord: <FaDiscord size={28} className="text-indigo-500" />,
    whatsapp: <FaWhatsapp size={28} className="text-green-500" />,
    telegram: <FaTelegramPlane size={28} className="text-blue-500" />,
    
    // Developer platforms
    github: <FaGithub size={28} className="text-gray-800 dark:text-white" />,
    
    // Media platforms
    spotify: <FaSpotify size={28} className="text-green-500" />,
    twitch: <FaTwitch size={28} className="text-purple-600" />,
    tiktok: <FaTiktok size={28} className="text-black dark:text-white" />,
    snapchat: <FaSnapchatGhost size={28} className="text-yellow-400" />,
    pinterest: <FaPinterestP size={28} className="text-red-600" />,
    reddit: <FaRedditAlien size={28} className="text-orange-600" />,
    medium: <FaMediumM size={28} className="text-green-800" />,
    
    // Others
    website: <TbWorld size={28} className="text-purple-500" />,
    rss: <MdRssFeed size={28} className="text-orange-500" />
  };

  return (
    <div className="px-4 py-8 page-content max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent gradient-text text-center"
          style={{ animation: 'slideDownFade 0.5s ease-out forwards' }}>
        My Socials
      </h2>

      <div className="space-y-4 social-links-container">
        {config.socialLinks.map((social: SocialLinkType, index: number) => {
          const uniqueId = `social-${social.icon}-${index}`;
          const animationDelay = `${0.15 + index * 0.08}s`;
          
          return (
            <div 
              key={uniqueId} 
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-all bg-white dark:bg-gray-800/40 shadow-sm dark:shadow-md border border-transparent dark:border-gray-700/50"
              style={{ 
                animation: 'slideUpFade 0.5s ease-out forwards',
                animationDelay,
                opacity: 0 // Start with opacity 0 until animation kicks in
              }}
            >
              <div 
                className="flex items-center justify-center w-14 h-14 rounded-full"
                style={{ 
                  backgroundColor: getBackgroundColor(social.icon),
                  animation: 'scaleIn 0.4s ease-out forwards',
                  animationDelay: `${parseFloat(animationDelay) + 0.1}s`
                }}
              >
                {iconMap[social.icon] || <Globe size={28} className="text-gray-600 dark:text-white" />}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-gray-900 dark:text-white truncate">{social.username}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{social.name}</div>
              </div>
              
              <div>
                {social.action === "copy" ? (
                  <button 
                    onClick={() => copyToClipboard(social.username, uniqueId)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-gray-900 dark:text-white transition-all shadow-sm hover:scale-105"
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    {copiedId === uniqueId ? (
                      <>
                        <Check size={16} className="text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="text-pink-600 dark:text-pink-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                ) : (
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-gray-900 dark:text-white transition-all shadow-sm hover:scale-105"
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <ExternalLink size={16} className="text-pink-600 dark:text-pink-400" />
                    <span>View</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get background color for social icons
function getBackgroundColor(icon: string): string {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const colorMap: Record<string, string> = {
    email: isDarkMode ? "rgba(251, 191, 36, 0.25)" : "rgba(251, 191, 36, 0.3)",
    gmail: isDarkMode ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.3)",
    facebook: isDarkMode ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.3)",
    instagram: isDarkMode ? "rgba(219, 39, 119, 0.25)" : "rgba(219, 39, 119, 0.3)",
    youtube: isDarkMode ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.3)",
    discord: isDarkMode ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.3)",
    spotify: isDarkMode ? "rgba(34, 197, 94, 0.25)" : "rgba(34, 197, 94, 0.3)",
    github: isDarkMode ? "rgba(55, 65, 81, 0.25)" : "rgba(55, 65, 81, 0.3)",
    twitter: isDarkMode ? "rgba(14, 165, 233, 0.25)" : "rgba(14, 165, 233, 0.3)",
    linkedin: isDarkMode ? "rgba(29, 78, 216, 0.25)" : "rgba(29, 78, 216, 0.3)",
    website: isDarkMode ? "rgba(168, 85, 247, 0.25)" : "rgba(168, 85, 247, 0.3)"
  };

  return colorMap[icon] || (isDarkMode ? "rgba(107, 114, 128, 0.15)" : "rgba(107, 114, 128, 0.3)");
}