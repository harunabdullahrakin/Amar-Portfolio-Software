import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConfigType, DiscoverType, DiscoverSectionType, DiscoverItemType } from "@/types";
import { ImageUploadDialog } from "@/components/ui/image-uploader";
import { Edit, X, ChevronUp, ChevronDown, Trash } from "lucide-react";
import AnalyticsViewer from "./AnalyticsViewer";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showComingSoon, setShowComingSoon] = useState(false); // Set to false to hide it by default
  const { toast } = useToast();
  
  // Function to safely access nested properties
  const getPerformanceSettings = () => {
    return config?.performanceSettings || {
      imageOptimization: false,
      analytics: false
    };
  };

  const { data: config, isLoading } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      window.location.href = "/admin"; // Redirect to login page
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading || !config) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showComingSoon && (
          <div className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Features in Development</h3>
                <p className="text-blue-700 mb-3">
                  We're constantly working to improve your experience! Here are some exciting features coming soon:
                </p>
                <ul className="space-y-1 text-blue-700 list-disc list-inside">
                  <li>Advanced navigation management (reordering and adding new items)</li>
                  <li><span className="line-through">Bulk social media link importing</span> <span className="text-green-600 font-medium">✓ Implemented!</span></li>
                  <li>Custom theme editor with color picker and layout options</li>
                  <li><span className="line-through">Image uploading for projects and profile</span> <span className="text-green-600 font-medium">✓ Implemented!</span></li>
                  <li>Analytics and visitor statistics</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowComingSoon(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white shadow-sm rounded-lg overflow-hidden">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "navigation" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("navigation")}
                  >
                    Navigation
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "socials" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("socials")}
                  >
                    Social Links
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "projects" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("projects")}
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "quicklinks" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("quicklinks")}
                  >
                    Quick Links
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "contact" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("contact")}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "formfields" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("formfields")}
                  >
                    Form Fields <span className="text-xs ml-1 text-purple-600">(Coming Soon)</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "discover" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("discover")}
                  >
                    Discover
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "analytics" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    Analytics
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "webhooks" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("webhooks")}
                  >
                    Webhooks
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "password" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "advanced" ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("advanced")}
                  >
                    Advanced Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
            {activeTab === "profile" && <ProfileEditor profile={config.profile} />}
            {activeTab === "navigation" && <NavigationEditor navigation={config.navigation} />}
            {activeTab === "socials" && <SocialsEditor socialLinks={config.socialLinks} />}
            {activeTab === "projects" && <ProjectsEditor projects={config.projects} />}
            {activeTab === "quicklinks" && <QuickLinksEditor quickLinks={config.quickLinks} />}
            {activeTab === "contact" && <ContactEditor contact={config.contact} />}
            {activeTab === "formfields" && <FormFieldsComingSoon />}
            {activeTab === "discover" && <DiscoverEditor discover={config.discover} />}
            {activeTab === "analytics" && <AnalyticsViewer />}
            {activeTab === "webhooks" && <WebhooksEditor webhooks={config.webhooks} />}
            {activeTab === "password" && <PasswordEditor />}
            {activeTab === "advanced" && <AdvancedSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Editor Component
function ProfileEditor({ profile }: { profile: any }) {
  const [formData, setFormData] = useState({
    id: profile.id,
    name: profile.name,
    title: profile.title,
    avatar: profile.avatar,
    banner: profile.banner,
    verified: profile.verified,
    bio: profile.bio,
    status: profile.status,
  });
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-profile", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleAvatarSelect = (imageUrl: string) => {
    setFormData({
      ...formData,
      avatar: imageUrl,
    });
  };

  const handleBannerSelect = (imageUrl: string) => {
    setFormData({
      ...formData,
      banner: imageUrl,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Avatar</label>
          <div className="flex space-x-2 items-end">
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowAvatarDialog(true)}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Choose Image
            </button>
          </div>
          {formData.avatar && (
            <div className="mt-2">
              <img src={formData.avatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Banner</label>
          <div className="flex space-x-2 items-end">
            <input
              type="text"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowBannerDialog(true)}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Choose Image
            </button>
          </div>
          {formData.banner && (
            <div className="mt-2">
              <img src={formData.banner} alt="Banner preview" className="w-full h-32 object-cover rounded-md" />
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium flex items-center">
              Verified 
              <span 
                className="ml-2 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs"
                style={{
                  background: 'linear-gradient(45deg, #4267B2, #1877F2)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5 12 10 17 19 8"></polyline>
                </svg>
              </span>
              <span className="ml-1 text-gray-500 text-xs">(shows verified checkmark next to name)</span>
            </span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Text status or a URL to display as an image"
          />
          <div className="mt-2 bg-blue-50 p-3 rounded-md text-sm">
            <p className="text-blue-700">
              <span className="font-medium">Pro tip:</span> You can use any image URL here (including Lanyard, Discord, etc.) to display an image instead of text.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                onClick={() => setFormData({
                  ...formData,
                  status: "https://lanyard.cnrad.dev/api/941207098434416700?rand=0.1466436524207101"
                })}
              >
                Use Lanyard API
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
                onClick={() => setFormData({
                  ...formData,
                  status: "I'm not currently doing anything!"
                })}
              >
                Reset to text
              </button>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Image Upload Dialogs */}
      <ImageUploadDialog
        isOpen={showAvatarDialog}
        onClose={() => setShowAvatarDialog(false)}
        onImageSelect={handleAvatarSelect}
      />
      
      <ImageUploadDialog
        isOpen={showBannerDialog}
        onClose={() => setShowBannerDialog(false)}
        onImageSelect={handleBannerSelect}
      />
    </div>
  );
}

// Placeholder components for other sections
// These would be implemented similar to ProfileEditor above

// Discover Editor Component
function DiscoverEditor({ discover }: { discover: DiscoverType | undefined }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(discover ? {
    title: discover.title || '',
    description: discover.description || '',
    sections: discover.sections || []
  } : {
    title: 'Discover',
    description: 'Check out my latest projects and content',
    sections: []
  });
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionIndex: number, itemIndex: number} | null>(null);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-discover", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Discover section updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating the discover section.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: Date.now(),
          title: "New Section",
          description: "Section description",
          items: []
        }
      ]
    });
  };

  const handleEditSection = (index: number) => {
    setEditingSectionIndex(index);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [name]: value
    };
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  const handleDeleteSection = (index: number) => {
    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);
    setFormData({
      ...formData,
      sections: updatedSections
    });
    setEditingSectionIndex(null);
  };

  const handleAddItem = (sectionIndex: number) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].items.push({
      id: Date.now(),
      title: "New Item",
      description: "Item description",
      image: "",
      url: "",
      tag: ""
    });
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  const handleEditItem = (sectionIndex: number, itemIndex: number) => {
    setEditingSectionIndex(sectionIndex);
    setEditingItemIndex(itemIndex);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, sectionIndex: number, itemIndex: number) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].items[itemIndex] = {
      ...updatedSections[sectionIndex].items[itemIndex],
      [name]: value
    };
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  const handleDeleteItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].items.splice(itemIndex, 1);
    setFormData({
      ...formData,
      sections: updatedSections
    });
    setEditingItemIndex(null);
  };

  const handleChooseImage = (sectionIndex: number, itemIndex: number) => {
    setCurrentImageField({ sectionIndex, itemIndex });
    setShowImageDialog(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (currentImageField) {
      const { sectionIndex, itemIndex } = currentImageField;
      const updatedSections = [...formData.sections];
      updatedSections[sectionIndex].items[itemIndex].image = imageUrl;
      setFormData({
        ...formData,
        sections: updatedSections
      });
      setCurrentImageField(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Discover Section</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Sections</h3>
          <div className="space-y-4 mb-4">
            {formData.sections.map((section: DiscoverSectionType, sectionIndex: number) => (
              <div key={section.id || sectionIndex} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{section.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditSection(sectionIndex)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sectionIndex)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {editingSectionIndex === sectionIndex && (
                  <div className="mb-4 space-y-3 p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Title</label>
                      <input
                        type="text"
                        name="title"
                        value={section.title}
                        onChange={(e) => handleSectionChange(e, sectionIndex)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Description</label>
                      <textarea
                        name="description"
                        value={section.description}
                        onChange={(e) => handleSectionChange(e, sectionIndex)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium mb-2">Items</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item: DiscoverItemType, itemIndex: number) => (
                      <div key={item.id || itemIndex} className="border rounded p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{item.title}</span>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditItem(sectionIndex, itemIndex)}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {editingSectionIndex === sectionIndex && editingItemIndex === itemIndex && (
                          <div className="space-y-3 mt-2">
                            <div>
                              <label className="block text-xs font-medium mb-1">Title</label>
                              <input
                                type="text"
                                name="title"
                                value={item.title}
                                onChange={(e) => handleItemChange(e, sectionIndex, itemIndex)}
                                className="w-full px-2 py-1 text-sm border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Description</label>
                              <textarea
                                name="description"
                                value={item.description}
                                onChange={(e) => handleItemChange(e, sectionIndex, itemIndex)}
                                className="w-full px-2 py-1 text-sm border rounded-md"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Image</label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  name="image"
                                  value={item.image}
                                  onChange={(e) => handleItemChange(e, sectionIndex, itemIndex)}
                                  className="w-full px-2 py-1 text-sm border rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleChooseImage(sectionIndex, itemIndex)}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                >
                                  Browse
                                </button>
                              </div>
                              {item.image && (
                                <div className="mt-2">
                                  <img src={item.image} alt={item.title} className="h-16 w-auto object-cover rounded" />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">URL</label>
                              <input
                                type="text"
                                name="url"
                                value={item.url}
                                onChange={(e) => handleItemChange(e, sectionIndex, itemIndex)}
                                className="w-full px-2 py-1 text-sm border rounded-md"
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Tag</label>
                              <input
                                type="text"
                                name="tag"
                                value={item.tag}
                                onChange={(e) => handleItemChange(e, sectionIndex, itemIndex)}
                                className="w-full px-2 py-1 text-sm border rounded-md"
                                placeholder="New, Featured, etc."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddItem(sectionIndex)}
                      className="border rounded p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                    >
                      <span className="text-gray-500">+ Add Item</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddSection}
              className="w-full border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
            >
              <span className="text-gray-500">+ Add Section</span>
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
      
      {/* Image Selection Dialog */}
      <ImageUploadDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}

function NavigationEditor({ navigation }: { navigation: any[] }) {
  const { toast } = useToast();
  const [navItems, setNavItems] = useState([...navigation]);
  const [editingNav, setEditingNav] = useState<null | {
    index: number;
    id: number;
    name: string;
    path: string;
    active: boolean;
  }>(null);
  
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-navigation", { navigation: navItems });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Navigation updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating the navigation.",
        variant: "destructive",
      });
    },
  });
  
  const handleEditNav = (item: any, index: number) => {
    setEditingNav({
      index,
      id: item.id,
      name: item.name,
      path: item.path,
      active: item.active
    });
  };
  
  const handleToggleActive = (index: number) => {
    const updatedItems = [...navItems];
    updatedItems[index] = {
      ...updatedItems[index],
      active: !updatedItems[index].active
    };
    setNavItems(updatedItems);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingNav) {
      const { name, value, type, checked } = e.target;
      setEditingNav({
        ...editingNav,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleSaveNavItem = () => {
    if (editingNav) {
      const updatedItems = [...navItems];
      updatedItems[editingNav.index] = {
        ...updatedItems[editingNav.index],
        name: editingNav.name,
        path: editingNav.path,
        active: editingNav.active
      };
      
      setNavItems(updatedItems);
      setEditingNav(null);
      
      toast({
        title: "Navigation item updated",
        description: "Don't forget to save all changes.",
      });
    }
  };
  
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedItems = [...navItems];
      const temp = updatedItems[index];
      updatedItems[index] = updatedItems[index - 1];
      updatedItems[index - 1] = temp;
      setNavItems(updatedItems);
    }
  };
  
  const handleMoveDown = (index: number) => {
    if (index < navItems.length - 1) {
      const updatedItems = [...navItems];
      const temp = updatedItems[index];
      updatedItems[index] = updatedItems[index + 1];
      updatedItems[index + 1] = temp;
      setNavItems(updatedItems);
    }
  };
  
  const handleSaveAll = () => {
    updateMutation.mutate();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Navigation</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <p className="text-blue-700">
          <strong>Note:</strong> You can reorder navigation items by using the up and down arrows, and toggle visibility with the status switch.
          Changes won't be saved until you click "Save Changes" at the bottom of the page.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        {navItems.map((item, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">Path: #{item.path}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-1 mr-2">
                  <button 
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === navItems.length - 1}
                  >
                    ↓
                  </button>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                  item.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => handleToggleActive(index)}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
                <button 
                  className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  onClick={() => handleEditNav(item, index)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      {/* Edit Navigation Item Modal */}
      {editingNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Navigation Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingNav.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Path</label>
                <div className="flex items-center">
                  <span className="mr-1 text-gray-500">#</span>
                  <input
                    type="text"
                    name="path"
                    value={editingNav.path}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={editingNav.active}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingNav(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNavItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SocialsEditor({ socialLinks }: { socialLinks: any[] }) {
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [links, setLinks] = useState(socialLinks);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");
  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    username: "",
    url: "",
    icon: "",
    action: "view"
  });

  // Update links in state when socialLinks prop changes
  useEffect(() => {
    setLinks(socialLinks);
  }, [socialLinks]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-social-link", editForm);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Social link updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      
      // Update the local state with the edited values
      if (editingIndex !== null) {
        const updatedLinks = [...links];
        updatedLinks[editingIndex] = { ...editForm };
        setLinks(updatedLinks);
      }
      
      // Reset editing state
      setEditingIndex(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your social link.",
        variant: "destructive",
      });
      console.error("Error updating social link:", error);
    },
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({
      id: links[index].id,
      name: links[index].name,
      username: links[index].username,
      url: links[index].url,
      icon: links[index].icon,
      action: links[index].action
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm({
      id: 0,
      name: "",
      username: "",
      url: "",
      icon: "",
      action: "view"
    });
  };

  const handleSave = () => {
    updateMutation.mutate();
  };

  const socialIcons = [
    { name: "Email", icon: "email" },
    { name: "Facebook", icon: "facebook" },
    { name: "Instagram", icon: "instagram" },
    { name: "Twitter", icon: "twitter" },
    { name: "LinkedIn", icon: "linkedin" },
    { name: "GitHub", icon: "github" },
    { name: "YouTube", icon: "youtube" },
    { name: "TikTok", icon: "tiktok" },
    { name: "Discord", icon: "discord" },
    { name: "Telegram", icon: "telegram" },
    { name: "Spotify", icon: "spotify" },
    { name: "Reddit", icon: "reddit" }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Social Links</h2>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {links.map((link, index) => (
          <div 
            key={index} 
            className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium truncate max-w-[200px]">{link.name}</h3>
              <button 
                onClick={() => handleEdit(index)}
                className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2 flex-shrink-0"
              >
                Edit
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-md mr-3 flex items-center justify-center"
                  style={{ backgroundColor: getBgColorForIcon(link.icon) }}
                >
                  <span className="text-white text-xl">
                    {link.icon === 'email' ? '✉️' : 
                     link.icon === 'facebook' ? 'f' : 
                     link.icon === 'instagram' ? '📷' : 
                     link.icon === 'twitter' ? '🐦' : 
                     link.icon === 'linkedin' ? 'in' : 
                     link.icon === 'github' ? '🐙' :
                     link.icon === 'discord' ? '🎮' :
                     link.icon === 'spotify' ? '🎵' :
                     link.icon === 'youtube' ? '▶️' : '🔗'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{link.username}</p>
                  <p className="text-sm text-gray-600 truncate">{link.url}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Action: {link.action === 'view' ? 'Open link' : 'Copy to clipboard'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit {links[editingIndex].name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  name="url"
                  value={editForm.url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select
                  name="icon"
                  value={editForm.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {socialIcons.map(icon => (
                    <option key={icon.icon} value={icon.icon}>{icon.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Action</label>
                <select
                  name="action"
                  value={editForm.action}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="view">Open link</option>
                  <option value="copy">Copy to clipboard</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => toast({
            title: "Feature in development",
            description: "Adding new social links will be available in a future update.",
          })}
        >
          Add New Social Link
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setShowBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>
      
      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h3 className="text-lg font-medium mb-4">Bulk Import Social Links</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Paste your social links in JSON format below. Each link should include name, username, url, icon, and action.
              </p>
              <div>
                <textarea
                  rows={10}
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  placeholder={`[
  {
    "name": "Twitter",
    "username": "@username",
    "url": "https://twitter.com/username",
    "icon": "twitter",
    "action": "view"
  },
  {
    "name": "GitHub",
    "username": "username",
    "url": "https://github.com/username",
    "icon": "github",
    "action": "view"
  }
]`}
                ></textarea>
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <p className="font-medium mb-1">Available icons:</p>
                <div className="flex flex-wrap gap-2">
                  {socialIcons.map(icon => (
                    <span key={icon.icon} className="px-2 py-1 bg-white border rounded-md">
                      {icon.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Show processing toast
                  toast({
                    title: "Processing links",
                    description: "Please wait while we import your social links...",
                  });
                  
                  try {
                    const importedLinks = JSON.parse(bulkImportText);
                    if (!Array.isArray(importedLinks)) {
                      throw new Error("The input must be an array");
                    }
                    
                    // Validate each link
                    const isValid = importedLinks.every(link => {
                      return typeof link.name === 'string' &&
                        typeof link.username === 'string' &&
                        typeof link.url === 'string' &&
                        typeof link.icon === 'string' &&
                        (link.action === 'view' || link.action === 'copy');
                    });
                    
                    if (!isValid) {
                      throw new Error("One or more links are missing required fields");
                    }
                    
                    // Use Promise.all to wait for all API calls to complete
                    const promises = importedLinks.map(link => 
                      apiRequest("POST", "/api/admin/update-social-link", {
                        id: 0, // New link
                        name: link.name,
                        username: link.username,
                        url: link.url,
                        icon: link.icon,
                        action: link.action
                      })
                    );
                    
                    await Promise.all(promises);
                    
                    setShowBulkImport(false);
                    setBulkImportText("");
                    
                    toast({
                      title: "Social links imported",
                      description: `${importedLinks.length} links have been imported successfully.`,
                    });
                    
                    // Refresh the data
                    queryClient.invalidateQueries({ queryKey: ["/api/config"] });
                  } catch (error) {
                    toast({
                      title: "Import failed",
                      description: "Please check your JSON format and try again.",
                      variant: "destructive",
                    });
                    console.error("Bulk import error:", error);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Import Links
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getBgColorForIcon(icon: string): string {
  const colors: Record<string, string> = {
    'email': '#D44638',
    'facebook': '#3b5998',
    'instagram': '#E1306C',
    'twitter': '#1DA1F2',
    'linkedin': '#0077B5',
    'github': '#333333',
    'youtube': '#FF0000',
    'tiktok': '#000000',
    'discord': '#5865F2',
    'telegram': '#0088cc',
    'spotify': '#1DB954',
    'reddit': '#FF4500'
  };

  return colors[icon] || '#6B7280';
}

function ProjectsEditor({ projects }: { projects: any }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: projects.id,
    title: projects.title,
    description: projects.description,
    items: [...projects.items]
  });
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [editingProject, setEditingProject] = useState<null | {
    index: number;
    name: string;
    icon: string;
    url: string;
    preview?: string;
  }>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    icon: "",
    url: "",
    preview: ""
  });
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [isAddingProjectIcon, setIsAddingProjectIcon] = useState(false);
  
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-project", formData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Projects updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating the projects.",
        variant: "destructive",
      });
    },
  });
  
  const handleEditProject = (project: any, index: number) => {
    setEditingProject({
      index,
      name: project.name,
      icon: project.icon,
      url: project.url,
      preview: project.preview || ""
    });
  };

  const handleTitleDescChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProject = () => {
    if (editingProject) {
      // Update the project in the items array
      const updatedItems = [...formData.items];
      updatedItems[editingProject.index] = {
        name: editingProject.name,
        icon: editingProject.icon,
        url: editingProject.url,
        preview: editingProject.preview
      };
      
      setFormData({
        ...formData,
        items: updatedItems
      });
      
      setEditingProject(null);
      
      toast({
        title: "Project updated",
        description: "Don't forget to save all changes.",
      });
    }
  };
  
  const handleAddProject = () => {
    setNewProject({
      name: "",
      icon: "",
      url: "",
      preview: ""
    });
    setShowAddProjectModal(true);
  };
  
  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (showAddProjectModal) {
      setNewProject({
        ...newProject,
        [name]: value
      });
    }
  };
  
  const handleSaveNewProject = () => {
    if (newProject.name && newProject.url) {
      setFormData({
        ...formData,
        items: [...formData.items, newProject]
      });
      
      setShowAddProjectModal(false);
      
      toast({
        title: "Project added",
        description: "Don't forget to save all changes.",
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please provide at least a name and URL for the project.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewProjectImageSelect = (imageUrl: string) => {
    setNewProject({
      ...newProject,
      icon: imageUrl
    });
    setShowImageDialog(false);
  };
  
  const handleDeleteProject = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleSaveAll = () => {
    updateMutation.mutate();
  };

  const handleImageSelect = (imageUrl: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        icon: imageUrl
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProject) {
      const { name, value } = e.target;
      setEditingProject({
        ...editingProject,
        [name]: value
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Projects</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium">Project Section Settings</h3>
        </div>
        
        <div className="space-y-4 mb-8 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleDescChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Section Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleTitleDescChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <p className="text-sm text-blue-600">
            <span className="font-medium">Note:</span> Changes to section settings will apply when you click "Save All Changes" at the bottom.
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Projects</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {projects.items.map((project: any, index: number) => (
          <div 
            key={index} 
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">{project.name}</h3>
              <button 
                onClick={() => handleEditProject(project, index)}
                className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Edit
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-md mr-3 flex items-center justify-center border">
                  {project.icon ? (
                    <img src={project.icon} alt={project.name} className="w-8 h-8" />
                  ) : (
                    <span className="text-gray-400">No icon</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 truncate">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {project.url}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProject.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project URL</label>
                <input
                  type="url"
                  name="url"
                  value={editingProject.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project Icon</label>
                <div className="flex space-x-2 items-center">
                  <div className="w-12 h-12 border rounded-md flex items-center justify-center">
                    {editingProject.icon ? (
                      <img src={editingProject.icon} alt="Icon" className="w-8 h-8" />
                    ) : (
                      <span className="text-gray-400">No icon</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProjectIcon(true);
                      setShowImageDialog(true);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Choose Icon
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Preview Image (Optional)</label>
                <div className="flex flex-col space-y-2">
                  {editingProject.preview ? (
                    <div className="relative w-full h-32 border rounded-md overflow-hidden">
                      <img 
                        src={editingProject.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProject({...editingProject, preview: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full border rounded-md p-4 text-center">
                      <span className="text-gray-400">No preview image</span>
                    </div>
                  )}
                  <input
                    type="url"
                    name="preview"
                    value={editingProject.preview || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/preview.jpg"
                  />
                  <p className="text-xs text-gray-500">Enter a URL to your project preview image</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => handleDeleteProject(editingProject.index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete Project
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Selection Dialog */}
      <ImageUploadDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onImageSelect={(imageUrl) => {
          if (isAddingProjectIcon) {
            handleNewProjectImageSelect(imageUrl);
          } else {
            handleImageSelect(imageUrl);
          }
          setShowImageDialog(false);
        }}
      />
      
      {/* Add New Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project URL</label>
                <input
                  type="text"
                  name="url"
                  value={newProject.url}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project Icon</label>
                <div className="flex space-x-2 items-center">
                  <div className="w-12 h-12 border rounded-md flex items-center justify-center">
                    {newProject.icon ? (
                      <img src={newProject.icon} alt="Icon" className="w-8 h-8" />
                    ) : (
                      <span className="text-gray-400">No icon</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProjectIcon(true);
                      setShowImageDialog(true);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Choose Icon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preview Image (Optional)</label>
                <div className="flex flex-col space-y-2">
                  {newProject.preview ? (
                    <div className="relative w-full h-32 border rounded-md overflow-hidden">
                      <img 
                        src={newProject.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setNewProject({...newProject, preview: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full border rounded-md p-4 text-center">
                      <span className="text-gray-400">No preview image</span>
                    </div>
                  )}
                  <input
                    type="text"
                    name="preview"
                    value={newProject.preview}
                    onChange={handleProjectInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/preview.jpg"
                  />
                  <p className="text-xs text-gray-500">Enter a URL to your project preview image</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddProjectModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewProject}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-center gap-4">
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleAddProject}
        >
          Add New Project
        </button>
        
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

function QuickLinksEditor({ quickLinks }: { quickLinks: any[] }) {
  const { toast } = useToast();
  const [links, setLinks] = useState([...quickLinks]);
  const [editingLink, setEditingLink] = useState<null | {
    index: number;
    name: string;
    url: string;
  }>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({
    name: "",
    url: ""
  });
  
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-quick-links", { quickLinks: links });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Quick links updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating the quick links.",
        variant: "destructive",
      });
    },
  });
  
  const handleEdit = (link: any, index: number) => {
    setEditingLink({
      index,
      name: link.name,
      url: link.url
    });
  };
  
  const handleRemove = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
    
    toast({
      title: "Link removed",
      description: "Don't forget to save your changes.",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (editingLink) {
      setEditingLink({
        ...editingLink,
        [name]: value
      });
    } else if (showAddModal) {
      setNewLink({
        ...newLink,
        [name]: value
      });
    }
  };
  
  const handleSaveLink = () => {
    if (editingLink) {
      const updatedLinks = [...links];
      updatedLinks[editingLink.index] = {
        name: editingLink.name,
        url: editingLink.url
      };
      
      setLinks(updatedLinks);
      setEditingLink(null);
      
      toast({
        title: "Link updated",
        description: "Don't forget to save all changes.",
      });
    }
  };
  
  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ name: "", url: "" });
      setShowAddModal(false);
      
      toast({
        title: "Link added",
        description: "Don't forget to save all changes.",
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please provide both a name and a URL.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveAll = () => {
    updateMutation.mutate();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Quick Links</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <p className="text-blue-700">
          <strong>Quick links</strong> are displayed on the user profile, enabling visitors to access your important links with a single click.
          Don't forget to click "Save Changes" after editing to apply your updates.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        {links.map((link, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-medium">{link.name}</h3>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-500 hover:underline"
                >
                  {link.url}
                </a>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  onClick={() => handleEdit(link, index)}
                >
                  Edit
                </button>
                <button 
                  className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="text-center p-8 border rounded-lg border-dashed">
            <p className="text-gray-500">No quick links added yet. Click the button below to add your first link.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
        
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => setShowAddModal(true)}
        >
          Add New Quick Link
        </button>
      </div>
      
      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Quick Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingLink.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="GitHub, YouTube, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="text"
                  name="url"
                  value={editingLink.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add New Quick Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newLink.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="GitHub, YouTube, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="text"
                  name="url"
                  value={newLink.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactEditor({ contact }: { contact: any }) {
  const [contactUrl, setContactUrl] = useState(contact.contactUrl || "");
  const [formFields, setFormFields] = useState(contact.formFields || []);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [newField, setNewField] = useState({ type: "text", label: "", required: false });
  const { toast } = useToast();

  // URL update mutation
  const updateUrlMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-contact-url", { contactUrl });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contact URL updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your contact URL.",
        variant: "destructive",
      });
    },
  });

  // Form fields update mutation
  const updateFormFieldsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-form-fields", { formFields });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Form fields updated",
        description: "Your contact form fields have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      setShowFieldEditor(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your form fields.",
        variant: "destructive",
      });
    },
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlMutation.mutate();
  };

  const handleFormFieldsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormFieldsMutation.mutate();
  };

  const addField = () => {
    if (!newField.label.trim()) {
      toast({
        title: "Missing label",
        description: "Please provide a label for the field.",
        variant: "destructive",
      });
      return;
    }
    
    setFormFields([...formFields, { ...newField }]);
    setNewField({ type: "text", label: "", required: false });
  };

  const removeField = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formFields.length - 1)
    ) {
      return; // Can't move further in this direction
    }

    const updatedFields = [...formFields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [updatedFields[index], updatedFields[targetIndex]] = 
    [updatedFields[targetIndex], updatedFields[index]];
    
    setFormFields(updatedFields);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Contact Settings</h2>
      
      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Contact Form vs. External URL</h3>
        <p className="text-blue-700 mb-2">
          You can choose between using the built-in contact form or redirecting users to an external URL:
        </p>
        <ul className="list-disc text-blue-700 ml-5">
          <li className="mb-1">
            <strong>Built-in form:</strong> Leave the URL field empty to use the built-in contact form with Discord webhook integration.
          </li>
          <li>
            <strong>External URL:</strong> Enter a URL (e.g., your email, Typeform, etc.) to redirect users there instead of showing the form.
          </li>
        </ul>
      </div>
      
      <form onSubmit={handleUrlSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact URL (Optional)</label>
          <input
            type="text"
            value={contactUrl}
            onChange={(e) => setContactUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://your-contact-url.com or mailto:your@email.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            If provided, clicking the Contact button will redirect to this URL instead of showing the built-in form.
          </p>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={updateUrlMutation.isPending}
        >
          {updateUrlMutation.isPending ? "Saving..." : "Save URL Changes"}
        </button>
      </form>
      
      <div className="mt-8 border-t pt-8 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Form Fields</h3>
          <button
            type="button"
            onClick={() => setShowFieldEditor(!showFieldEditor)}
            className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
          >
            {showFieldEditor ? (
              <>
                <X size={16} className="mr-1" /> Cancel Editing
              </>
            ) : (
              <>
                <Edit size={16} className="mr-1" /> Edit Form Fields
              </>
            )}
          </button>
        </div>
        
        {showFieldEditor ? (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-medium mb-4">Customize Form Fields</h4>
            
            <div className="mb-6">
              <form onSubmit={(e) => { e.preventDefault(); addField(); }} className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-1">Field Label</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField({...newField, label: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g. Full Name"
                  />
                </div>
                
                <div className="w-[140px]">
                  <label className="block text-sm font-medium mb-1">Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({...newField, type: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>
                
                <div className="w-[100px] pt-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({...newField, required: e.target.checked})}
                      className="rounded border-gray-300 mr-2"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                </div>
                
                <div className="pt-5">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
                  >
                    Add Field
                  </button>
                </div>
              </form>
            </div>
            
            <h4 className="font-medium mb-3">Current Form Fields</h4>
            
            {formFields.length === 0 ? (
              <p className="text-gray-500 p-4 bg-gray-50 rounded-md">
                No form fields defined. Add fields using the form above.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {formFields.map((field, index) => (
                  <div key={index} className="flex items-center bg-gray-50 p-3 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-gray-500">
                        {field.type === 'textarea' ? 'Multi-line Text' : 
                          field.type === 'email' ? 'Email Address' : 'Single Line Text'}
                        {field.required && ' • Required'}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-md ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === formFields.length - 1}
                        className={`p-1 rounded-md ${index === formFields.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFormFieldsSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={updateFormFieldsMutation.isPending}
              >
                {updateFormFieldsMutation.isPending ? "Saving..." : "Save Form Fields"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-medium mb-4">Current Form Fields</h4>
            
            {formFields.length === 0 ? (
              <p className="text-gray-500 p-4 bg-gray-50 rounded-md text-center">
                No custom form fields defined. Click "Edit Form Fields" to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {formFields.map((field, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium">{field.label}</div>
                    <div className="text-sm text-gray-500">
                      {field.type === 'textarea' ? 'Multi-line Text' : 
                        field.type === 'email' ? 'Email Address' : 'Single Line Text'}
                      {field.required && ' • Required'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WebhooksEditor({ webhooks }: { webhooks: any }) {
  const [discordWebhook, setDiscordWebhook] = useState(webhooks.discord || "");
  const [testMessage, setTestMessage] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-webhook", { discord: discordWebhook });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Webhook updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your webhook.",
        variant: "destructive",
      });
    },
  });
  
  const testWebhookMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/test-webhook", { 
        discord: discordWebhook,
        message: testMessage || "This is a test message from your website contact form!"
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test successful",
        description: "The test message was sent to your Discord webhook.",
      });
      setIsTesting(false);
      setTestMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Test failed",
        description: "There was an error sending the test message. Please check your webhook URL.",
        variant: "destructive",
      });
      setIsTesting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };
  
  const handleTestWebhook = () => {
    if (!discordWebhook) {
      toast({
        title: "No webhook URL",
        description: "Please enter a Discord webhook URL before testing.",
        variant: "destructive",
      });
      return;
    }
    setIsTesting(true);
  };
  
  const sendTestMessage = () => {
    testWebhookMutation.mutate();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Webhooks</h2>
      
      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Discord Webhook Integration</h3>
        <p className="text-blue-700">
          When someone submits your contact form, the information will be sent to your Discord server via webhook.
          Learn how to <a href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" target="_blank" rel="noopener noreferrer" className="underline">create a Discord webhook</a>.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Discord Webhook URL</label>
          <input
            type="text"
            value={discordWebhook}
            onChange={(e) => setDiscordWebhook(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://discord.com/api/webhooks/..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste your Discord webhook URL here to receive contact form submissions.
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            type="button"
            onClick={handleTestWebhook}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Test Webhook
          </button>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      
      {/* Test Webhook Modal */}
      {isTesting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Test Discord Webhook</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This will send a test message to your Discord webhook. You can customize the message below:
              </p>
              <div>
                <label className="block text-sm font-medium mb-1">Test Message</label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="This is a test message from your website contact form!"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsTesting(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendTestMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={testWebhookMutation.isPending}
              >
                {testWebhookMutation.isPending ? "Sending..." : "Send Test Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormFieldsComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-lg bg-purple-50 border-purple-200 rounded-xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-purple-800 mb-2">Form Field Manager</h2>
        <p className="text-purple-700 text-center mb-6">
          This feature is coming soon! You'll be able to customize the form fields in your contact form.
        </p>
        <div className="space-y-4">
          <div className="border border-purple-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 rounded-full bg-purple-200 mr-2"></div>
              <div className="h-4 w-32 bg-purple-100 rounded"></div>
            </div>
            <div className="h-8 w-full bg-purple-50 rounded"></div>
          </div>
          <div className="border border-purple-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 rounded-full bg-purple-200 mr-2"></div>
              <div className="h-4 w-24 bg-purple-100 rounded"></div>
            </div>
            <div className="h-8 w-full bg-purple-50 rounded"></div>
          </div>
          <div className="border border-purple-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 rounded-full bg-purple-200 mr-2"></div>
              <div className="h-4 w-40 bg-purple-100 rounded"></div>
            </div>
            <div className="h-20 w-full bg-purple-50 rounded"></div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-purple-600">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}

function AdvancedSettings() {
  const { toast } = useToast();
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 60 * 1000,
  });
  
  const [lightThemeColor, setLightThemeColor] = useState("#FFFFFF");
  const [darkThemeColor, setDarkThemeColor] = useState("#121212");
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0");
  const [secondaryColor, setSecondaryColor] = useState("#4CAF50");
  const [borderRadius, setBorderRadius] = useState("8");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loadingLetter, setLoadingLetter] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load owner email, loading letter, and loading text when config is loaded
  useEffect(() => {
    if (config?.ownerSettings?.email) {
      setOwnerEmail(config.ownerSettings.email);
    }
    if (config?.ownerSettings?.loadingLetter) {
      setLoadingLetter(config.ownerSettings.loadingLetter);
    }
    if (config?.ownerSettings?.loadingText) {
      setLoadingText(config.ownerSettings.loadingText);
    } else {
      setLoadingText("Loading...");
    }
  }, [config]);
  
  const resetDatabaseMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await apiRequest("POST", "/api/admin/reset-database");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || "Failed to reset database");
        }
        return await response.json();
      } catch (err) {
        console.error("Database reset error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Database Reset",
        description: "The database has been reset to first-time setup. You will be logged out shortly.",
      });
      // Logout and redirect to setup page after a short delay
      setTimeout(() => {
        window.location.href = "/setup";
      }, 2000);
    },
    onError: (error: Error) => {
      console.error("Reset database mutation error:", error);
      toast({
        title: "Reset Failed",
        description: `There was an error resetting the database: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  });
  
  const updateOwnerEmailMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/update-owner-email", { email: ownerEmail });
    },
    onSuccess: () => {
      toast({
        title: "Email Updated",
        description: "Owner's email has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the owner's email.",
        variant: "destructive",
      });
    }
  });
  
  const updateLoadingLetterMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/update-loading-letter", { letter: loadingLetter });
    },
    onSuccess: () => {
      toast({
        title: "Loading Letter Updated",
        description: "The loading screen letter has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the loading letter.",
        variant: "destructive",
      });
    }
  });
  
  const updateLoadingTextMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/update-loading-text", { text: loadingText });
    },
    onSuccess: () => {
      toast({
        title: "Loading Text Updated",
        description: "The loading screen text has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the loading text.",
        variant: "destructive",
      });
    }
  });
  
  const handleReset = () => {
    setIsResetting(true);
    resetDatabaseMutation.mutate();
  };
  
  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }
    updateOwnerEmailMutation.mutate();
  };
  
  const handleUpdateLoadingLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadingLetter) {
      toast({
        title: "Letter Required",
        description: "Please enter a single letter.",
        variant: "destructive",
      });
      return;
    }
    // Only use the first character if multiple characters are entered
    const singleLetter = loadingLetter.charAt(0);
    if (singleLetter !== loadingLetter) {
      setLoadingLetter(singleLetter);
    }
    updateLoadingLetterMutation.mutate();
  };
  
  const handleUpdateLoadingText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadingText) {
      toast({
        title: "Text Required",
        description: "Please enter the text to show below the loading letter.",
        variant: "destructive",
      });
      return;
    }
    updateLoadingTextMutation.mutate();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feature in development",
      description: "Theme customization will be available in a future update.",
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
      
      <div className="space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Theme Customization</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Light Mode Background</label>
                <div className="flex">
                  <input
                    type="color"
                    value={lightThemeColor}
                    onChange={(e) => setLightThemeColor(e.target.value)}
                    className="h-10 w-10 mr-2"
                  />
                  <input
                    type="text"
                    value={lightThemeColor}
                    onChange={(e) => setLightThemeColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Dark Mode Background</label>
                <div className="flex">
                  <input
                    type="color"
                    value={darkThemeColor}
                    onChange={(e) => setDarkThemeColor(e.target.value)}
                    className="h-10 w-10 mr-2"
                  />
                  <input
                    type="text"
                    value={darkThemeColor}
                    onChange={(e) => setDarkThemeColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 mr-2"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <div className="flex">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 mr-2"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Radius (px)</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                </div>
                <div className="mt-2 text-center">
                  Current value: {borderRadius}px
                </div>
              </div>
              
              <div className="flex items-end">
                <div 
                  className="p-4 border rounded-md w-full"
                  style={{ borderRadius: `${borderRadius}px`, backgroundColor: primaryColor }}
                >
                  <div className="text-white font-medium">Preview</div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Theme Settings
            </button>
          </form>
        </div>
        
        {/* Owner Email Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Owner Contact Settings</h3>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Owner's Email Address</label>
              <div className="space-y-2">
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="owner@example.com"
                />
                <p className="text-sm text-gray-500">
                  This email will be used to receive contact form submissions and system notifications.
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={updateOwnerEmailMutation.isPending}
            >
              {updateOwnerEmailMutation.isPending ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>
        
        {/* Loading Screen Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Loading Screen Settings</h3>
          
          {/* Loading Letter Form */}
          <form onSubmit={handleUpdateLoadingLetter} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Loading Letter</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={loadingLetter}
                  onChange={(e) => setLoadingLetter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="H"
                  maxLength={1}
                />
                <p className="text-sm text-gray-500">
                  The letter displayed on the loading screen. Only single letters A-Z are supported.
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="border rounded-md p-4 flex justify-center bg-gray-50">
                {/* Letter preview */}
                <div className="w-20 h-20 relative">
                  <svg width="100%" height="100%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path 
                        d={
                          loadingLetter.toUpperCase() === "A" ? "M256 0L0 512h64l54.4-128h266.4L439.2 512h64L256 0zm0 73.43L394.46 336H117.54L256 73.43z" : 
                          loadingLetter.toUpperCase() === "B" ? "M128 0v512h160c70.4 0 128-57.6 128-128 0-38.4-16-73.6-44.8-96 28.8-25.6 44.8-60.8 44.8-96 0-70.4-57.6-128-128-128H128zm64 64h96c32 0 64 32 64 64s-32 64-64 64H192V64zm0 192h96c32 0 64 32 64 64s-32 64-64 64H192V256z" :
                          loadingLetter.toUpperCase() === "C" ? "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c74.6 0 145.1-32.3 193.6-88.6l-45.3-45.3c-37.4 44.8-93.1 70.9-148.3 70.9-106 0-192-86-192-192s86-192 192-192c55.2 0 110.9 26.1 148.3 70.9l45.3-45.3C401.1 32.3 330.6 0 256 0z" :
                          loadingLetter.toUpperCase() === "D" ? "M128 0v512h160c106.4 0 192-85.6 192-192V192c0-106.4-85.6-192-192-192H128zm64 64h96c70.4 0 128 57.6 128 128v128c0 70.4-57.6 128-128 128H192V64z" :
                          loadingLetter.toUpperCase() === "E" ? "M128 0v512h320v-64H192v-160h192v-64H192V64h256V0H128z" :
                          loadingLetter.toUpperCase() === "F" ? "M128 0v512h64V288h192v-64H192V64h256V0H128z" :
                          loadingLetter.toUpperCase() === "G" ? "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c74.6 0 145.1-32.3 193.6-88.6l-45.3-45.3c-37.4 44.8-93.1 70.9-148.3 70.9-106 0-192-86-192-192s86-192 192-192c47.6 0 93.9 16.9 130.1 47.5L448 112v-16C398.5 36.8 329.3 0 256 0z" :
                          loadingLetter.toUpperCase() === "I" ? "M224 0v512h64V0h-64z" :
                          loadingLetter.toUpperCase() === "J" ? "M352 0v384c0 32-32 64-64 64s-64-32-64-64H160c0 70.4 57.6 128 128 128s128-57.6 128-128V0h-64z" :
                          loadingLetter.toUpperCase() === "K" ? "M128 0v512h64V288l224 224h96L288 288 512 64h-96L192 224V0h-64z" :
                          loadingLetter.toUpperCase() === "L" ? "M128 0v512h320v-64H192V0h-64z" :
                          loadingLetter.toUpperCase() === "M" ? "M128 0v512h64V169.6L320 384l128-214.4V512h64V0h-64L320 256 192 0h-64z" :
                          loadingLetter.toUpperCase() === "N" ? "M128 0v512h64V107.2L448 512h64V0h-64v404.8L192 0h-64z" :
                          loadingLetter.toUpperCase() === "O" ? "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z" :
                          loadingLetter.toUpperCase() === "P" ? "M128 0v512h64V256h160c70.4 0 128-57.6 128-128S422.4 0 352 0H128zm64 64h160c32 0 64 32 64 64s-32 64-64 64H192V64z" :
                          loadingLetter.toUpperCase() === "Q" ? "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c49.5 0 97.5-14.1 138.6-40.8l71.4 71.4 45.3-45.3-71.4-71.4C466 383.5 512 322.4 512 256c0-141.4-114.6-256-256-256zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z" :
                          loadingLetter.toUpperCase() === "R" ? "M128 0v512h64V288h117.6L448 512h76.8L371.2 288c44.8-22.4 76.8-64 76.8-128C448 67.2 380.8 0 288 0H128zm64 64h96c53.7 0 96 42.3 96 96s-42.3 96-96 96H192V64z" :
                          loadingLetter.toUpperCase() === "S" ? "M256 0C114.6 0 0 114.6 0 256h64c0-106 86-192 192-192s192 86 192 192-86 192-192 192c-38.4 0-73.6-16-96-44.8L96 448h160c141.4 0 256-114.6 256-256S397.4 0 256 0z" :
                          loadingLetter.toUpperCase() === "T" ? "M224 64v448h64V64h160V0H64v64h160z" :
                          loadingLetter.toUpperCase() === "U" ? "M128 0v320c0 70.4 57.6 128 128 128s128-57.6 128-128V0h-64v320c0 32-32 64-64 64s-64-32-64-64V0h-64z" :
                          loadingLetter.toUpperCase() === "V" ? "M256 0L128 512h64l86.4-384 86.4 384h64L256 0z" :
                          loadingLetter.toUpperCase() === "W" ? "M128 0L64 512h64l32-256 96 192 96-192 32 256h64L384 0h-64L256 192 192 0h-64z" :
                          loadingLetter.toUpperCase() === "X" ? "M128 0L0 128l192 128L0 384l128 128 128-192 128 192 128-128-192-128 192-128L384 0 256 192 128 0z" :
                          loadingLetter.toUpperCase() === "Y" ? "M256 256v256h64V256l192-256h-76.8L320 170.4 204.8 0H128l128 256z" :
                          loadingLetter.toUpperCase() === "Z" ? "M64 0v64l284.8 341.6H64V448h384v-64L163.2 43.2H448V0H64z" :
                          "m466 512h-128.498v-210.877h-163.003v210.877h-128.499v-512h128.499v189.922h163.003v-189.922h128.498zm-98.498-30h68.498v-452h-68.498v189.922h-223.003v-189.922h-68.499v452h68.499v-210.877h223.003z"
                        }
                        fill={primaryColor}
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={updateLoadingLetterMutation.isPending}
            >
              {updateLoadingLetterMutation.isPending ? "Updating..." : "Update Loading Letter"}
            </button>
          </form>
          
          {/* Loading Text Form */}
          <form onSubmit={handleUpdateLoadingText} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loading Text</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={loadingText}
                  onChange={(e) => setLoadingText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Loading..."
                  maxLength={50}
                />
                <p className="text-sm text-gray-500">
                  The text displayed below the loading letter on the loading screen.
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-base font-medium text-gray-600">{loadingText || "Loading..."}</div>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={updateLoadingTextMutation.isPending}
            >
              {updateLoadingTextMutation.isPending ? "Updating..." : "Update Loading Text"}
            </button>
          </form>
        </div>

        {/* Database Reset Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Database Management</h3>
          <div className="p-4 border border-red-300 rounded-md bg-red-50">
            <h4 className="font-medium text-red-800 mb-2">Reset Database</h4>
            <p className="text-sm text-red-700 mb-4">
              This will reset the entire database to first-time setup mode. All data will be lost,
              including admin users, profile information, and customizations. This action cannot be undone.
            </p>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Reset Database
              </button>
            ) : (
              <div className="bg-white p-4 rounded-md border border-red-300 mt-2">
                <p className="font-bold text-red-800 mb-3">Are you absolutely sure?</p>
                <p className="text-sm text-gray-700 mb-4">
                  This will permanently delete all data and reset the application to its initial state.
                  You will be immediately logged out, and will need to complete the setup process again.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    disabled={isResetting}
                  >
                    {isResetting ? "Resetting..." : "Yes, Reset Everything"}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    disabled={isResetting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Performance Settings Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Performance Settings</h3>
          <div className="space-y-6">
            {/* Image Optimization Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Image Optimization</p>
                <p className="text-sm text-gray-500">Automatically optimize images for faster loading</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    config.performanceSettings?.imageOptimization 
                      ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!config.performanceSettings?.imageOptimization}
                  onClick={async () => {
                    try {
                      await apiRequest("POST", "/api/admin/performance-settings", {
                        imageOptimization: false,
                        analytics: config.performanceSettings?.analytics || false
                      });
                      
                      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
                      
                      toast({
                        title: "Image optimization disabled",
                        description: "Your website will no longer automatically optimize images.",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update performance settings.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Disable
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md ${
                    !config.performanceSettings?.imageOptimization 
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={config.performanceSettings?.imageOptimization}
                  onClick={async () => {
                    try {
                      await apiRequest("POST", "/api/admin/performance-settings", {
                        imageOptimization: true,
                        analytics: config.performanceSettings?.analytics || false
                      });
                      
                      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
                      
                      toast({
                        title: "Image optimization enabled",
                        description: "Your website will now automatically optimize images for faster loading.",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update performance settings.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Enable
                </button>
              </div>
            </div>
            
            {/* Current Status */}
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Image Optimization Status:</span>
                <span className={`text-sm px-2.5 py-0.5 rounded-full ${
                  config.performanceSettings?.imageOptimization 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}>
                  {config.performanceSettings?.imageOptimization ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {config.performanceSettings?.imageOptimization 
                  ? "Images uploaded to your site will be automatically optimized to reduce file size while maintaining quality."
                  : "Image optimization is disabled. Enable it to improve page load times."}
              </div>
            </div>
            
            {/* Analytics Toggle */}
            <div className="flex items-center justify-between mt-6">
              <div>
                <p className="font-medium">Website Analytics</p>
                <p className="text-sm text-gray-500">Track visitor statistics (privacy-friendly)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    config.performanceSettings?.analytics 
                      ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!config.performanceSettings?.analytics}
                  onClick={async () => {
                    try {
                      await apiRequest("POST", "/api/admin/performance-settings", {
                        imageOptimization: config.performanceSettings?.imageOptimization || false,
                        analytics: false
                      });
                      
                      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
                      
                      toast({
                        title: "Analytics disabled",
                        description: "Your website will no longer collect visitor statistics.",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update performance settings.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Disable
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md ${
                    !config.performanceSettings?.analytics 
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={config.performanceSettings?.analytics}
                  onClick={async () => {
                    try {
                      await apiRequest("POST", "/api/admin/performance-settings", {
                        imageOptimization: config.performanceSettings?.imageOptimization || false,
                        analytics: true
                      });
                      
                      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
                      
                      toast({
                        title: "Analytics enabled",
                        description: "Your website will now collect anonymous visitor statistics.",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update performance settings.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Enable
                </button>
              </div>
            </div>
            
            {/* Analytics Status */}
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analytics Status:</span>
                <span className={`text-sm px-2.5 py-0.5 rounded-full ${
                  config.performanceSettings?.analytics 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}>
                  {config.performanceSettings?.analytics ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {config.performanceSettings?.analytics 
                  ? "Your site is collecting anonymous visitor data. View detailed stats in the Analytics tab."
                  : "Analytics tracking is disabled. No visitor data is being collected."}
              </div>
              
              {config.performanceSettings?.analytics && (
                <div className="mt-3">
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Analytics Dashboard →
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordEditor() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-password", {
        currentPassword,
        newPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}