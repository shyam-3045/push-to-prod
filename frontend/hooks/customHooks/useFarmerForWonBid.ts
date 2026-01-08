// hooks/useFarmerForWonBid.ts
import { useQuery } from "@tanstack/react-query";
import { getFarmerForWonBid } from "../services/retailer";

export const useFarmerForWonBid = (bidId: string | null) => {
  return useQuery({
    queryKey: ["won-bid-farmer", bidId],
    queryFn: () => getFarmerForWonBid(bidId!),
    enabled: !!bidId
  });
};
