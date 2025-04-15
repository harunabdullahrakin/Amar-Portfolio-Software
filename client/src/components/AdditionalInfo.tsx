import { AdditionalInfoType } from "@/types";

interface AdditionalInfoProps {
  additionalInfo: AdditionalInfoType;
}

// Personal info section showing bio and skills
export default function AdditionalInfo({ additionalInfo }: AdditionalInfoProps) {
  // Skip rendering if no data
  if (!additionalInfo) {
    return null;
  }

  // Cool neon-style skill badges
  const badgeClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-pink-900 hover:border-pink-500 transition-colors duration-300";
  
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">About me</h2>
        <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">{additionalInfo.about}</p>
      </div>
      
      {/* Only render skills section if there are skills */}
      {additionalInfo.skills?.length > 0 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">Skills</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {additionalInfo.skills.map((skill, index) => (
              <span 
                key={`skill-${index}-${skill.replace(/\s+/g, '-')}`}
                className={badgeClasses}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
