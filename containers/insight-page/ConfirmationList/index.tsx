"use client"

import { getConfirmations } from "@/actions/insight"
import { queryKey } from "@/config"
import { useInsightStore } from "@/store/insight"
import { SectionType } from "@/types/Edit"
import { AnalyserConfirmation } from "@/types/Insight"
import { useInfiniteQuery } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Confirmation from "./ConfirmationList"
import Filter from "./Filter"
import style from "./style.module.scss"
const cx = cs.bind(style)

const ConfirmationList = ({ formSections }: { formSections?: SectionType[] }) => {
  const { pageId } = useParams()

  const { t } = useTranslation(["insight-page"])
  const { curFilter, curSort, searchInput, isFilterUpdate, setIsFilterUpdate } = useInsightStore([
    "curFilter",
    "curSort",
    "searchInput",
    "isFilterUpdate",
    "setIsFilterUpdate",
  ])

  const { data, refetch } = useInfiniteQuery<AnalyserConfirmation[], Error>({
    queryKey: queryKey.insightSearch(pageId as string),
    queryFn: ({ pageParam }) =>
      getConfirmations({
        cursor: pageParam,
        pageId: pageId as string,
        curFilter,
        curSort,
        searchInput,
      }),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length,
  })

  useEffect(() => {
    if (isFilterUpdate) {
      refetch()
      setIsFilterUpdate(false)
    }
  }, [isFilterUpdate, refetch, setIsFilterUpdate])

  const lists = data?.pages.flat()

  return (
    <div className={cx("layout")}>
      <Filter formSections={formSections} />
      <div className={cx("list-container")}>
        {lists && lists?.length > 0 ? (
          lists.map((v: AnalyserConfirmation, i: number) => <Confirmation confirmation={v} key={`list-${i}`} />)
        ) : (
          <div className={cx("no-list")}>
            <img src="/images/icons/disappointed.png" alt="disappointed" />
            <span>{t("emptySearch")}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfirmationList
