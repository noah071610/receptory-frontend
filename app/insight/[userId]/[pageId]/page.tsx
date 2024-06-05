"use client"

import style from "@/containers/insight-page/style.module.scss"
import cs from "classNames/bind"

import { getInsight } from "@/actions/insight"
import PageLoading from "@/components/Loading/LoadingPage"
import { queryKey } from "@/config"
import PageInfo from "@/containers/insight-page/PageInfo"
import { usePageValidator } from "@/hooks/usePageValidator"
import UserPageLayout from "@/layout/UserPageLayout"
import { InsightPageType } from "@/types/Insight"
import { useQuery } from "@tanstack/react-query"
const cx = cs.bind(style)

const InsightPage = () => {
  const { pageId, user } = usePageValidator({ isAuth: true })

  const { data: pageData, isSuccess } = useQuery<InsightPageType>({
    queryKey: queryKey.insight(pageId),
    queryFn: () => getInsight(pageId),
    enabled: !!user?.userId,
  })

  return (
    user && (
      <UserPageLayout>
        {isSuccess && pageData ? (
          <>
            <PageInfo pageData={pageData} user={user} />
          </>
        ) : (
          <PageLoading isLoading={true} />
        )}
      </UserPageLayout>
    )
  )
}

export default InsightPage
