import { useQuery } from "@tanstack/react-query";
import { getRunningBids } from "../services/retailerRunningBids.service";

export const useRunningBids = () => {
  return useQuery({
    queryKey: ["retailer-running-bids"],
    queryFn: getRunningBids,
    refetchInterval: 5_000, 
  });
};
