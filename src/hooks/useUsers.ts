"use client";

import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher);

  return { data, error, isLoading, mutate }
}

export default useUsers;
