import { SocialLinkType } from "@/types";
import {
  FaDiscord,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitch,
  FaMedium,
  FaDev,
  FaDribbble,
  FaBehance,
  FaReddit,
  FaStackOverflow,
  FaLink,
} from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { ConfigType } from "@/types";

interface SocialLinksProps {
  socialLinks: SocialLinkType[];
}

export default function SocialLinks({ socialLinks }: SocialLinksProps) {
  // No point rendering empty section
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Connect with me</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((link, index) => (
          <SocialLink key={`social-${link.name}-${index}`} link={link} />
        ))}
      </div>
    </div>
  );
}

// Individual social link card component
function SocialLink({ link }: { link: SocialLinkType }) {
  // Get metrics configuration to track clicks
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  // Function to handle clicks and report to Discord webhook if configured
  const handleClick = () => {
    if (config?.webhooks?.discord) {
      try {
        fetch(config.webhooks.discord, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `Social link clicked: ${link.name} (${link.url}) at ${new Date().toISOString()}`,
            username: 'Website Analytics',
          }),
        });
      } catch (error) {
        console.error('Failed to send to Discord webhook:', error);
      }
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700"
    >
      {/* Icon container with glow effect */}
      <div 
        className={`
          flex-shrink-0 w-12 h-12 rounded-full 
          ${getBgColorForIcon(link.icon)} 
          flex items-center justify-center 
          ${getTextColorForIcon(link.icon)}
          shadow-md hover:shadow-lg transition-shadow duration-300
        `}
      >
        {renderIcon(link.icon)}
      </div>
      
      {/* Platform name and username */}
      <div className="ml-4 overflow-hidden">
        <h3 className="text-sm font-medium text-white truncate max-w-[150px]">{link.name}</h3>
        <p className="text-xs text-gray-400 truncate max-w-[150px]">{link.username}</p>
      </div>
    </a>
  );
}

// Map social network name to icon component
function renderIcon(icon: string) {
  const iconSize = "h-6 w-6";
  
  switch (icon.toLowerCase()) {
    case "discord":
      return <FaDiscord className={iconSize} />;
    case "github":
      return <FaGithub className={iconSize} />;
    case "twitter":
      return <FaTwitter className={iconSize} />;
    case "linkedin":
      return <FaLinkedin className={iconSize} />;
    case "instagram":
      return <FaInstagram className={iconSize} />;
    case "facebook":
      return <FaFacebook className={iconSize} />;
    case "youtube":
      return <FaYoutube className={iconSize} />;
    case "twitch":
      return <FaTwitch className={iconSize} />;
    case "medium":
      return <FaMedium className={iconSize} />;
    case "dev":
      return <FaDev className={iconSize} />;
    case "dribbble":
      return <FaDribbble className={iconSize} />;
    case "behance":
      return <FaBehance className={iconSize} />;
    case "reddit":
      return <FaReddit className={iconSize} />;
    case "stackoverflow":
      return <FaStackOverflow className={iconSize} />;
    case "substack":
      return <SiSubstack className={iconSize} />;
    default:
      // Fallback for any unrecognized platforms
      return <FaLink className={iconSize} />;
  }
}

// Background color based on brand identity
function getBgColorForIcon(icon: string): string {
  switch (icon.toLowerCase()) {
    case "discord": return "bg-indigo-900";
    case "github": return "bg-gray-900";
    case "twitter": return "bg-blue-900";
    case "linkedin": return "bg-blue-900";
    case "instagram": return "bg-pink-900";
    case "facebook": return "bg-blue-900";
    case "youtube": return "bg-red-900";
    case "twitch": return "bg-purple-900";
    case "medium": return "bg-gray-900";
    case "dev": return "bg-black";
    case "dribbble": return "bg-pink-900";
    case "behance": return "bg-blue-900";
    case "reddit": return "bg-orange-900";
    case "stackoverflow": return "bg-orange-900";
    case "substack": return "bg-yellow-900";
    default: return "bg-gray-900";
  }
}

// Text color based on brand identity
function getTextColorForIcon(icon: string): string {
  switch (icon.toLowerCase()) {
    case "discord": return "text-indigo-400";
    case "github": return "text-gray-300";
    case "twitter": return "text-blue-400";
    case "linkedin": return "text-blue-400";
    case "instagram": return "text-pink-400";
    case "facebook": return "text-blue-400";
    case "youtube": return "text-red-400";
    case "twitch": return "text-purple-400";
    case "medium": return "text-gray-300";
    case "dev": return "text-white";
    case "dribbble": return "text-pink-400";
    case "behance": return "text-blue-400";
    case "reddit": return "text-orange-400";
    case "stackoverflow": return "text-orange-400";
    case "substack": return "text-yellow-400";
    default: return "text-gray-300";
  }
}
