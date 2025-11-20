// src/api/auth.ts

export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// example: http://localhost:3000

export const sendOtpApi = async (payload: SendOtpPayload) => {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send OTP");
  }

  return res.json();
};

export const verifyOtpApi = async (payload: VerifyOtpPayload) => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to verify OTP");
  }

  return res.json();
};
