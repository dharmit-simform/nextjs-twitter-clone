"use client";

import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUser = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/users/${userId}` : null, fetcher);

  return { data, error, isLoading, mutate }
}

export default useUser;
