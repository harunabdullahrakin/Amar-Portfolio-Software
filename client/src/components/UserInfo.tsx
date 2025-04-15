import { useQuery } from "@tanstack/react-query";
import { ConfigType, QuickLinkType } from "@/types";

export default function UserInfo() {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  if (!config) return null;

  return (
    <div>
      <h2 className="section-title">About Me</h2>
      <p className="text-center text-gray-700 whitespace-pre-line mb-8">
        {config.profile.bio}
      </p>

      {/* Quick links */}
      <div className="flex justify-center gap-4 mb-8">
        {config.quickLinks.map((link: QuickLinkType, index: number) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white py-2 px-6 rounded-full"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Status */}
      <div className="bg-black text-gray-300 p-1 rounded-lg mb-8 flex justify-center">
        {config.profile.status.startsWith('http') ? (
          <img 
            src={config.profile.status} 
            alt="Status" 
            className="max-w-full rounded"
            onError={(e) => {
              // Fallback in case the image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentNode as HTMLElement;
              parent.innerHTML += '<p class="text-center italic">Status image failed to load</p>';
            }}
          />
        ) : (
          <p className="text-center italic p-2">{config.profile.status}</p>
        )}
      </div>
    </div>
  );
}