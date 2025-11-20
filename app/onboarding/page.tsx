"use client";

import { useState } from "react";
import { useSubmitOnboarding } from "../../hooks/onboarding/useOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");

  // Backend expects these
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    country: "",
  });

  // Backend expects these FILE field names
  const [documents, setDocuments] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    selfie: null as File | null,
  });

  const mutation = useSubmitOnboarding();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof documents
  ) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({ ...documents, [field]: e.target.files[0] });
    }
  };

  const handleNext = () => {
    setError(""); // reset error

    if (currentStep === 1) {
      // Personal Details validation
      if (
        !formData.fullName.trim() ||
        !formData.phoneNumber.trim() ||
        !formData.country.trim()
      ) {
        toast.error("Please fill all personal details.");
        return;
      }
    } else if (currentStep === 2) {
      // ID Documents validation
      if (!documents.aadhaar || !documents.pan) {
        toast.error("Please upload Aadhaar and PAN.");
        return;
      }
    } else if (currentStep === 3) {
      // Selfie validation
      if (!documents.selfie) {
        toast.error("Please upload your selfie.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
    toast.success("Step completed!");
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setError("");

    // ✅ Validation
    if (
      !formData.fullName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.country.trim() ||
      !documents.aadhaar ||
      !documents.pan ||
      !documents.selfie
    ) {
      toast.error("Please fill all fields and upload all documents.");
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("country", formData.country);

    data.append("aadhaar", documents.aadhaar);
    data.append("pan", documents.pan);
    data.append("selfie", documents.selfie);

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        if (res?.success === false || res?.error) {
          toast.error(res.message || "Something went wrong");
          return;
        }

        toast.success("Onboarding submitted successfully!");
        router.push("/dashboard");
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to submit onboarding";
        toast.error(message);
      },
    });
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Complete Onboarding
      </h1>

      {/* Step 1 */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Details</h2>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              className="text-green-600"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              className="text-green-600"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              className="text-green-600"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ID Documents</h2>

          <div className="space-y-2">
            <Label>Aadhaar Card</Label>
            <Input
              type="file"
              className="text-green-600"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "aadhaar")}
            />
            {documents.aadhaar && (
              <p className="text-green-600 text-sm">{documents.aadhaar.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>PAN Card</Label>
            <Input
              type="file"
              className="text-green-600"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "pan")}
            />
            {documents.pan && (
              <p className="text-green-600 text-sm">{documents.pan.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Selfie</h2>

          <div className="space-y-2">
            <Label>Upload Selfie</Label>
            <Input
              type="file"
              className="text-green-600"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "selfie")}
            />
            {documents.selfie && (
              <p className="text-green-600 text-sm">{documents.selfie.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 4 – Review */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Review Information</h2>

          <div className="space-y-3">
            {[
              ["Name", formData.fullName],
              ["Phone", formData.phoneNumber],
              ["Country", formData.country],
              ["Aadhaar", documents.aadhaar?.name],
              ["PAN", documents.pan?.name],
              ["Selfie", documents.selfie?.name],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-2">
                <span className="font-medium text-white">{label}:</span>
                <span className="text-green-600 font-semibold">
                  {value || "Not Provided"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 text-sm mt-4 bg-red-100 p-3 rounded">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}

        {currentStep < 4 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending} // use mutation object directly
            className="flex items-center justify-center gap-2"
          >
            {mutation.isPending && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
