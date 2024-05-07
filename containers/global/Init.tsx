"use client"
import { getUser, refreshUser } from "@/actions/user"
import { useMainStore } from "@/store/main"
import { PropsWithChildren, useEffect } from "react"

const Init: React.FC<PropsWithChildren> = ({ children }) => {
  const { setUser } = useMainStore()
  useEffect(() => {
    const fetchData = async () => {
      const user = await refreshUser()

      if (user) {
        const { user: _user } = await getUser()

        if (_user) {
          setUser({ user: _user })
        } else {
          // refresh 토큰의ㅣ 유저로 대체, 이쪽으로 오면 에러이기 때문에 고쳐야함
          if (user) setUser({ user })
        }
      } else {
        // refresh 토큰의ㅣ 유저로 대체, 이쪽으로 오면 에러이기 때문에 고쳐야함
        if (user) setUser({ user })
      }
    }

    fetchData()
  }, [])

  return <>{children}</>
}

export default Init
