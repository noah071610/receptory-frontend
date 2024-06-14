"use client"

import { queryKey } from "@/config"
import { useInsightStore } from "@/store/insight"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const AdjustFilterButton = () => {
  const { pageId } = useParams()
  const queryClient = useQueryClient()

  const { curFilter } = useInsightStore(["curFilter"])

  const { t } = useTranslation(["insight-page"])

  const isReadyToFilter = useMemo(() => {
    switch (curFilter.type) {
      case "none":
        return true
      case "calendar":
      case "createdAt":
      case "time":
        return !!curFilter.startQuery
      default:
        break
    }
  }, [curFilter])

  const refetch = () => {
    typeof pageId === "string" &&
      queryClient.invalidateQueries({
        queryKey: queryKey.insightSearch(pageId),
      })
  }

  return (
    <div className={cx("btn-wrapper")}>
      <button onClick={refetch} disabled={!isReadyToFilter}>
        <span>{t("adjustFilter")}</span>
      </button>
    </div>
  )
}

export default AdjustFilterButton
