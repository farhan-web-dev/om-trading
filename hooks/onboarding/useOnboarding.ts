// lib/hooks/useSubmitOnboarding.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { submitOnboarding } from "@/lib/api/onboarding";

export const useSubmitOnboarding = (): UseMutationResult<
  any,       // type of success response
  Error,     // type of error
  FormData,  // type of variables (input)
  unknown    // context type
> => {
  return useMutation({
    mutationFn: (formData: FormData) => submitOnboarding(formData),
  });
};
