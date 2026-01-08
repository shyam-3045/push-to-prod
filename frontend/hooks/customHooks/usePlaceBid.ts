import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placeBid } from "../services/retailerBid.service";
import type { PlaceBidResponse } from "../services/retailerBid.service";

interface PlaceBidPayload {
  produceId: string;
  bidAmount: number;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PlaceBidResponse,   // mutation result
    Error,              // error type
    PlaceBidPayload     // payload type
  >({
    mutationFn: placeBid,

    onSuccess: () => {
      // 🔁 refresh running bids
      queryClient.invalidateQueries({
        queryKey: ["retailer-running-bids"],
      });

      // 🔁 refresh available produces
      queryClient.invalidateQueries({
        queryKey: ["retailer-produces"],
      });
    },
  });
};
