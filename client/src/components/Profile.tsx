import { ProfileType } from "@/types";
import { MapPin } from "lucide-react";

interface ProfileProps {
  profile: ProfileType;
}

// Main profile component showing user info & avatar
export default function Profile({ profile }: ProfileProps) {
  const avatarSize = "h-40 w-40";
  
  return (
    <div className="mb-12 text-center">
      <div className="flex flex-col items-center profile-header">
        {/* Avatar with glow effect and animation */}
        <div className="mb-6 relative" style={{ animation: 'scaleIn 0.8s ease-out forwards, pulseGlow 3s infinite alternate' }}>
          <div className="absolute inset-0 rounded-full bg-pink-500 blur-md opacity-50"
               style={{ animation: 'pulseGlow 3s infinite alternate-reverse' }}></div>
          <img
            className={`${avatarSize} rounded-full object-cover border-4 border-gray-700 relative z-10`}
            src={profile.avatar}
            alt={`${profile.name}'s profile picture`}
            style={{ animation: 'scaleIn 0.5s ease-out 0.3s forwards' }}
          />
        </div>
        
        {/* Name with larger size for impact and verified icon if enabled */}
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center"
            style={{ animation: 'slideDownFade 0.6s ease-out forwards' }}>
          {profile.name}
          {profile.verified && (
            <span 
              className="ml-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm" 
              title="Verified"
              style={{
                background: 'linear-gradient(45deg, #4267B2, #1877F2)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                animation: 'bounce 2s infinite'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="5 12 10 17 19 8"></polyline>
              </svg>
            </span>
          )}
        </h1>
        
        {/* Title with vibrant color and animated gradient */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-medium text-xl mb-4 gradient-text"
           style={{ animation: 'slideDownFade 0.7s ease-out forwards' }}>
          {profile.title}
        </p>
        
        {/* Bio with card-like appearance with rounded borders and adaptive text colors */}
        <div className="bg-white/90 dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg mb-4 backdrop-blur-sm 
                        border border-gray-200 dark:border-gray-700/50 max-w-2xl mx-auto 
                        hover:shadow-xl transition-all duration-300"
             style={{ animation: 'slideUpFade 0.8s ease-out forwards' }}>
          <h3 className="text-xl font-medium mb-3 text-pink-500 dark:text-pink-400 text-center">About Me</h3>
          <p className="text-black dark:text-white leading-relaxed">
            {profile.bio}
          </p>
        </div>
        
        {/* Location badge with responsive light/dark theme styling */}
        {profile.location && (
          <div className="mt-2" style={{ animation: 'slideUpFade 0.9s ease-out forwards' }}>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 transition-all hover:shadow-md hover:scale-105">
              <MapPin className="h-4 w-4 mr-1 text-pink-500 dark:text-pink-400" />
              {profile.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
