import { useQuery } from "@tanstack/react-query";
import { getMyProfile, getUserById } from "../services/user";


export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId, 
  });
};


export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile
  });
};