import { useQuery } from "@tanstack/react-query";
import { ConfigType, ProjectItemType } from "@/types";
import { ExternalLink, Image, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Projects() {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });
  const [showLogos, setShowLogos] = useState(true);

  if (!config) return null;

  return (
    <div className="px-4 py-8 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          {config.projects.title}
        </h2>
        
        <button 
          onClick={() => setShowLogos(!showLogos)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={showLogos ? "Hide logos" : "Show logos"}
        >
          {showLogos ? (
            <>
              <EyeOff size={14} />
              <span>Hide Logos</span>
            </>
          ) : (
            <>
              <Image size={14} />
              <span>Show Logos</span>
            </>
          )}
        </button>
      </div>
      <p className="text-gray-400 mb-8">{config.projects.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.projects.items.map((project: ProjectItemType, index: number) => (
          <ProjectCard 
            key={index} 
            project={project} 
            showLogo={showLogos} 
            style={{ 
              animationDelay: `${index * 0.1}s`
            }} 
          />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectItemType;
  showLogo?: boolean;
  style?: React.CSSProperties;
}

function ProjectCard({ project, showLogo = true, style }: ProjectCardProps) {
  // Generate random pastel background color for projects without images
  const generateRandomPastelColor = () => {
    const fallbackColors = [
      "from-pink-500/20 to-purple-500/20",
      "from-blue-500/20 to-cyan-500/20",
      "from-green-500/20 to-emerald-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-red-500/20 to-pink-500/20",
      "from-violet-500/20 to-indigo-500/20"
    ];
    
    return fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
  };
  
  const bgGradient = generateRandomPastelColor();

  return (
    <a
      href={project.url}
      className="block group h-full rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        animation: 'scaleIn 0.5s ease-out forwards',
        opacity: 0,
        ...style
      }}
    >
      <div 
        className="relative h-full min-h-[240px] rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col"
        style={{
          backgroundImage: project.preview ? `url(${project.preview})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better text readability */}
        <div 
          className={`absolute inset-0 ${project.preview 
            ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80' 
            : `bg-gradient-to-br ${bgGradient}`}`}
        ></div>
        
        {/* Project Content */}
        <div className="relative p-5 flex flex-col h-full z-10">
          {/* Project Icon - conditionally displayed */}
          {showLogo && (
            <div 
              className="w-16 h-16 mb-4 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all"
              style={{animation: 'scaleIn 0.4s ease-out forwards'}}
            >
              {project.icon ? (
                <img 
                  src={project.icon} 
                  alt={project.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    // Just show placeholder instead
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><text x="50%" y="50%" font-family="Arial" font-size="10" text-anchor="middle" dominant-baseline="middle">${project.name.charAt(0)}</text></svg>`;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 text-white text-2xl font-bold">
                  {project.name.charAt(0)}
                </div>
              )}
            </div>
          )}
          
          {/* Project Name */}
          <h3 className={`text-xl font-bold text-white ${showLogo ? 'mb-2' : 'mt-2 mb-4'} drop-shadow-sm`}>
            {project.name}
          </h3>
          
          {/* View Project Link */}
          <div className="mt-auto pt-4 flex items-center gap-1.5 text-sm text-pink-300 group-hover:text-pink-200 font-medium">
            <span>View Project</span>
            <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </a>
  );
}