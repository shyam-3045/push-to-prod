import { useQuery } from "@tanstack/react-query";
import { getRetailerProduces } from "../services/retailerProduce";

export const useRetailerProduces = () => {
  return useQuery({
    queryKey: ["retailer-produces"],
    queryFn: getRetailerProduces,
    refetchInterval: 5_000
  });
};
