import { UserType } from "@/types/User"
/* eslint-disable react-hooks/exhaustive-deps */
import { getUser } from "@/actions/user"
import { queryKey } from "@/config"
import { PageType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

export const usePageValidator = ({
  isAuth,
  isPage,
  isEdit,
  initialData,
}: {
  isAuth?: boolean
  isPage?: boolean
  isEdit?: boolean
  initialData?: PageType
}) => {
  const { push, back } = useRouter()
  const { userId, pageId } = useParams()
  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
    enabled: isAuth && typeof userId === "string",
  })

  // PAGE
  useLayoutEffect(() => {
    if (isPage) {
      if (!initialData) {
        alert("페이지를 로드하지 못했습니다.")
        return back()
      }
      if (initialData.format === "inactive") {
        alert("현재 비공개 상태인 페이지입니다.")
        return back()
      }
    }
  }, [isPage, initialData])

  // EDIT
  useLayoutEffect(() => {
    if (isEdit) {
      if (typeof pageId !== "string") {
        alert("잘못된 접근입니다.")
        return back()
      }
    }
  }, [isEdit])

  // AUTH
  useLayoutEffect(() => {
    // 잘못된 url 접근 차단
    if (isAuth) {
      if (typeof userId !== "string") {
        alert("잘못된 접근입니다.")
        return back()
      }

      if (isFetchedUserQuery) {
        // 로그인 요청을 이미 보냄. 이제부터 판별 시작

        // 로그인 안했네?
        if (!user) {
          alert("로그인을 해주세요")
          push("/login")
        }

        // 남의 페이지를 왜 들어가? 미친놈 아님? ㅡㅡ
        if (user?.userId !== userId) {
          alert("잘못된 접근입니다.")
          back()
        }
      }
    }
  }, [user, userId, isAuth, isFetchedUserQuery])

  return {
    user: user as UserType,
    pageId: pageId as string,
  }
}
