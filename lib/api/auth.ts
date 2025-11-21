export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const signupApi = async (payload: SignupPayload) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({})); // in case backend returns no json

  if (!res.ok) {
    throw new Error(data.message || data.error || "Signup failed");
  }

  return data;
};

export const loginApi = async (payload: LoginPayload) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  return data;
};
