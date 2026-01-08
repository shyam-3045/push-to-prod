import { useQuery } from "@tanstack/react-query";
import { getMyProduces } from "@/hooks/services/produce";

export const useProduces = () => {
  return useQuery({
    queryKey: ["my-produces"],
    queryFn: getMyProduces,
    refetchInterval: 60_000
  });
};
