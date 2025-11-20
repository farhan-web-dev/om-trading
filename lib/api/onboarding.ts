// lib/api/onboarding.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const submitOnboarding = async (formData: FormData) => {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${BASE_URL}/user/onboarding`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ DO NOT set Content-Type for FormData
    },
  });

  // THROW ERROR IF STATUS IS NOT OK
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to submit onboarding (server error)"
    );
  }

  return response.json();
};
