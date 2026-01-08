import { useQuery } from "@tanstack/react-query";
import { getWonBids } from "../services/retailer";

export const useWonBids = () => {
  return useQuery({
    queryKey: ["won-bids"],
    queryFn: getWonBids,
    refetchInterval: 5_000
  });
};
