import { useQuery } from "@tanstack/react-query";
import { ConfigType, FormFieldType } from "@/types";
import { useState } from "react";

export default function Contact() {
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!config) return null;

  // If contactUrl is defined, redirect to that URL instead of showing the form
  const handleContactClick = () => {
    if (config.contact.contactUrl) {
      window.open(config.contact.contactUrl, "_blank");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare form data to send to the server
      const requiredFields = {
        username: formData["Username"] || formData["Name"] || formData["name"] || formData["Full Name"] || "",
        email: formData["Email:"] || formData["Email"] || formData["email"] || "",
        message: formData["Message:"] || formData["Message"] || formData["message"] || "",
      };
      
      // Check if required fields are filled
      if (!requiredFields.username || !requiredFields.email || !requiredFields.message) {
        console.log("Missing required fields:", {
          username: Boolean(requiredFields.username),
          email: Boolean(requiredFields.email),
          message: Boolean(requiredFields.message)
        });
        
        setError("Please fill in all required fields (Username, Email, and Message)");
        setSubmitting(false);
        return;
      }
      
      console.log("Submitting form data:", { requiredFields, formData });
      
      // Send form data to server API endpoint
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requiredFields,
          ...formData  // Include all form fields
        }),
      });
      
      console.log("Form submission response status:", response.status);
      const result = await response.json();
      console.log("Form submission result:", result);
      
      if (result.success) {
        // Show success modal instead of alert
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({});
        
        // Reset form elements
        const form = document.getElementById('contact-form') as HTMLFormElement;
        if (form) {
          form.reset();
        }
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send form:", error);
      setError("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">{config.contact.title}</h2>

      {config.contact.contactUrl ? (
        <div className="contact-button-container">
          <button 
            onClick={handleContactClick}
            className="contact-url-button animate-pulse-glow"
          >
            <span className="flex items-center">
              <svg 
                className="w-5 h-5 mr-2 animate-bounce" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {config.contact.buttonText}
            </span>
          </button>
        </div>
      ) : (
        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
          {config.contact.formFields.map((field: FormFieldType, index: number) => (
            <div key={index} className="form-field">
              <label>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.label}
                  required={field.required}
                  rows={4}
                  onChange={handleChange}
                  value={formData[field.label] || ""}
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  name={field.label}
                  required={field.required}
                  onChange={handleChange}
                  value={formData[field.label] || ""}
                />
              )}
            </div>
          ))}
          {error && (
            <div className="form-error" style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="form-button submit-button"
              disabled={submitting}
            >
              {submitting ? "Sending..." : config.contact.submitButton}
            </button>
            <button
              type="reset"
              className="form-button cancel-button"
              disabled={submitting}
            >
              {config.contact.cancelButton}
            </button>
          </div>
        </form>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for your message. We'll get back to you as soon as possible.</p>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .success-modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 90%;
          width: 400px;
          text-align: center;
        }
        
        .success-icon {
          color: #4CAF50;
          margin-bottom: 1rem;
        }
        
        .success-modal h3 {
          margin: 0 0 1rem;
          font-size: 1.5rem;
        }
        
        .success-modal p {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .success-modal button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .success-modal button:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
}