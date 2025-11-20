// lib/hooks/useSubmitOnboarding.ts
import { useMutation } from "@tanstack/react-query";
import { submitOnboarding } from "@/lib/api/onboarding";

export const useSubmitOnboarding = () => {
  return useMutation({
    mutationFn: (formData: FormData) => submitOnboarding(formData),
  });
};
