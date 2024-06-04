"use client"

import style from "@/containers/insight-page/style.module.scss"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { getInsight } from "@/actions/insight"
import PageLoading from "@/components/Loading/LoadingPage"
import { queryKey } from "@/config"
import { usePageValidator } from "@/hooks/usePageValidator"
import { useMainStore } from "@/store/main"
import { SaveType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
const cx = cs.bind(style)

const InsightPage = () => {
  const { pageId, user } = usePageValidator({ isAuth: true })
  const [isModalLoading, setIsModalLoading] = useState(false)
  const pathname = usePathname()
  const { lang } = useParams()
  const { push, back } = useRouter()
  const { modal } = useMainStore()
  const [save, setSave] = useState<null | SaveType>(null)

  // todo : 타입
  const { data, isLoading } = useQuery<any[]>({
    queryKey: queryKey.insight(pageId),
    queryFn: () => getInsight(pageId),
    enabled: !!user?.userId,
  })

  console.log(data)

  return (
    <div className={cx("main")}>
      <div className={cx("content")}>{isLoading ? <PageLoading isLoading={isLoading} /> : <></>}</div>
    </div>
  )
}

export default InsightPage
