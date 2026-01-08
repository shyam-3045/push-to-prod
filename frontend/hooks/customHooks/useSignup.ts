// hooks/customHooks/useSignup.ts
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/hooks/services/auth";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      console.log("Signup success");
    },

    onError: (error: any) => {
      console.error(
        error?.response?.data?.message || "Signup failed"
      );
    }
  });
};
