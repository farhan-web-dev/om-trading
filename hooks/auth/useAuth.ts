// src/hooks/useAuth.ts

import { useMutation } from "@tanstack/react-query";
import {
  sendOtpApi,
  verifyOtpApi,
  SendOtpPayload,
  VerifyOtpPayload,
} from "@/lib/api/auth";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpPayload) => sendOtpApi(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => verifyOtpApi(data),
  });
};
