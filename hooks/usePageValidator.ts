import { UserType } from "@/types/User"
/* eslint-disable react-hooks/exhaustive-deps */
import { getUser } from "@/actions/user"
import { queryKey } from "@/config"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"

export const usePageValidator = ({ isAuth, isEdit }: { isAuth?: boolean; isEdit?: boolean }) => {
  const { push, back } = useRouter()
  const { userId, pageId } = useParams()
  const { t } = useTranslation(["messages"])
  const { data: user, isFetched: isFetchedUserQuery } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
    enabled: isAuth && typeof userId === "string",
  })

  // EDIT
  useLayoutEffect(() => {
    if (isEdit) {
      if (typeof pageId !== "string") {
        alert(t("error.invalidAccess"))
        return back()
      }
    }
  }, [isEdit])

  // AUTH
  useLayoutEffect(() => {
    // 잘못된 url 접근 차단
    if (isAuth) {
      if (typeof userId !== "string") {
        alert(t("error.invalidAccess"))
        return back()
      }

      if (isFetchedUserQuery) {
        // 로그인 요청을 이미 보냄. 이제부터 판별 시작

        // 로그인 안했네?
        if (!user) {
          alert(t("error.login"))
          return push("/login")
        }

        // 남의 페이지를 왜 들어가? 미친놈 아님? ㅡㅡ
        if (user?.userId !== userId) {
          alert(t("error.invalidAccess"))
          return back()
        }
      }
    }
  }, [user, userId, isAuth, isFetchedUserQuery])

  return {
    user: user as UserType,
    pageId: pageId as string,
  }
}
