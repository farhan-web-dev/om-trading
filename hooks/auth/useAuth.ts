import { useMutation } from "@tanstack/react-query";
import {
  signupApi,
  loginApi,
  SignupPayload,
  LoginPayload,
} from "@/lib/api/auth";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => signupApi(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => loginApi(data),
  });
};
