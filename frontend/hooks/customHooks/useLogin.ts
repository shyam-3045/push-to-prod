// hooks/customHooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/hooks/services/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      console.log("Login success");
    },

    onError: (error: any) => {
      console.error(
        error?.response?.data?.message || "Login failed"
      );
    }
  });
};
