import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
}

export function ImageUploader({
  onImageUpload,
  className = "",
  buttonText = "Upload Image",
  showPreview = true,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create a preview
      if (showPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Convert file to base64
      const base64 = await convertFileToBase64(file);

      // Upload image
      const response = await apiRequest("POST", "/api/admin/upload-image", {
        image: base64,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Call the callback with the uploaded image URL
      onImageUpload(data.url);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the image",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button
        onClick={triggerFileInput}
        disabled={isUploading}
        className="mb-2"
        variant="outline"
      >
        {isUploading ? "Uploading..." : buttonText}
      </Button>
      
      {showPreview && preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-md border object-cover"
            style={{ maxHeight: "150px" }}
          />
        </div>
      )}
    </div>
  );
}

// Gallery component for selecting from previously uploaded images
export function ImageGallery({
  onSelect,
  className = "",
}: {
  onSelect: (imageUrl: string) => void;
  className?: string;
}) {
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/admin/images");
      const data = await response.json();
      
      if (Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast({
        title: "Error loading images",
        description: "Could not load your uploaded images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load images when component mounts
  useState(() => {
    loadImages();
  });

  const handleDelete = async (fileName: string) => {
    try {
      await apiRequest("DELETE", `/api/admin/images/${fileName}`);
      await loadImages(); // Reload images after deletion
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete the image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-4 text-gray-500">No images uploaded yet</div>;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {images.map((image) => (
        <div key={image.name} className="relative group">
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-90"
            onClick={() => onSelect(image.url)}
          />
          <button
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(image.name);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export function ImageUploadDialog({
  onImageSelect,
  isOpen,
  onClose,
}: {
  onImageSelect: (imageUrl: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");

  const handleImageUpload = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Choose an Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "upload"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload New
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "gallery"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            Image Gallery
          </button>
        </div>

        {activeTab === "upload" ? (
          <div className="py-2">
            <ImageUploader
              onImageUpload={handleImageUpload}
              buttonText="Choose an image to upload"
              showPreview={true}
            />
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 50MB.
            </p>
          </div>
        ) : (
          <div className="py-2">
            <ImageGallery onSelect={handleImageUpload} />
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}