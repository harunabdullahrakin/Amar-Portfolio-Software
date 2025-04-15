import { useQuery } from "@tanstack/react-query";
import { ConfigType, DiscoverSectionType, DiscoverItemType } from "@/types";
import { 
  ExternalLink, 
  Calendar, 
  Archive, 
  Users, 
  Sparkles,
  Code,
  GanttChart,
  Star
} from "lucide-react";

export default function Discover() {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  if (!config) return null;

  // If no discover configuration exists, just use an empty template
  const discover = config.discover || {
    title: "Discover",
    description: "",
    sections: [],
    stats: {
      showStats: false,
      experienceYears: 0,
      customStats: []
    }
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
        {discover.title}
      </h2>
      
      {discover.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          {discover.description}
        </p>
      )}
      
      <div className="space-y-10">
        {discover.sections.map((section: DiscoverSectionType, sectionIndex: number) => (
          <div key={`section-${sectionIndex}`} className="bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3 text-center">{section.title}</h3>
              {section.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                  {section.description}
                </p>
              )}
              
              {section.items && section.items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {section.items.map((item: DiscoverItemType, itemIndex: number) => (
                    <ItemCard key={`item-${sectionIndex}-${itemIndex}`} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {discover.stats && discover.stats.showStats && (
        <div className="mt-8 bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-sm dark:shadow-none">
          <h3 className="text-xl font-medium mb-5 text-center">Skills & Experience</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {discover.stats.experienceYears && (
              <div className="text-center bg-gray-100 dark:bg-black dark:bg-opacity-40 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
                  <Calendar size={16} />
                  <span>Experience</span>
                </div>
                <div className="font-medium text-xl">{discover.stats.experienceYears}+ years</div>
              </div>
            )}
            
            {discover.stats.customStats && discover.stats.customStats.map((stat, statIndex) => {
              const icons = [
                <Archive size={16} />, 
                <Users size={16} />,
                <Sparkles size={16} />,
                <Code size={16} />,
                <GanttChart size={16} />,
                <Star size={16} />
              ];
              
              return (
                <div 
                  key={`stat-${statIndex}`} 
                  className="text-center bg-gray-100 dark:bg-black dark:bg-opacity-40 p-4 rounded-lg"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
                    {icons[statIndex % icons.length]}
                    <span>{stat.label}</span>
                  </div>
                  <div className="font-medium text-xl">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <a 
          href={`mailto:${config.ownerSettings?.email || config.profile.name.toLowerCase().replace(/\s+/g, '')}@example.com`}
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
          text-white font-medium rounded-md px-6 py-3 text-sm transition-all duration-300"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: DiscoverItemType }) {
  return (
    <div className="bg-gray-100 dark:bg-black dark:bg-opacity-40 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      {item.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      
      <div className="p-4">
        {item.tag && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              {item.tag}
            </span>
          </div>
        )}
        
        <h4 className="font-medium mb-2">{item.title}</h4>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
          {item.description}
        </p>
        
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            <span>Learn more</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}