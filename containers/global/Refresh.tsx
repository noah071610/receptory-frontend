"use client"

import { refreshUser } from "@/actions/user"
import { queryKey } from "@/config"
import { UserType } from "@/types/User"
import { useQuery } from "@tanstack/react-query"

const Refresh = () => {
  const { data: user } = useQuery<UserType | null>({
    queryKey: queryKey.user,
    queryFn: refreshUser,
    refetchOnWindowFocus: true,
  })

  return <></>
}

export default Refresh
