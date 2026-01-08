import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/user";

export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId, // IMPORTANT
  });
};
