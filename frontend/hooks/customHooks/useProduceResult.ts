import { useQuery } from "@tanstack/react-query";
import { getProduceResult } from "../services/farmer";

export const useProduceResult = (produceId: string) => {
  return useQuery({
    queryKey: ["produce-result", produceId],
    queryFn: () => getProduceResult(produceId),
    enabled: !!produceId
  });
};
