"use client"

import cs from "classNames/bind"
import style from "./style.module.scss"

import { getInsight } from "@/actions/insight"
import PageLoading from "@/components/Loading/LoadingPage"
import { queryKey } from "@/config"
import CalendarChart from "@/containers/insight-page/Charts/Calendar"
import SelectListChart from "@/containers/insight-page/Charts/SelectList"
import SubmitChart from "@/containers/insight-page/Charts/Submit"
import TimeChart from "@/containers/insight-page/Charts/Time"
import ConfirmationList from "@/containers/insight-page/ConfirmationList"
import PageInfo from "@/containers/insight-page/PageInfo"
import { usePageValidator } from "@/hooks/usePageValidator"
import { useMainStore } from "@/store/main"
import { InsightPageType, SelectChartType } from "@/types/Insight"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
const cx = cs.bind(style)

const getChartArr = (type: "choices" | "select", pageData: InsightPageType) =>
  pageData.content.formSections
    .filter((v) => v.type === type)
    .reduce((acc, cur) => {
      // 애널라이저에 섹션이, 실제 폼에 있는가
      const target = pageData.analyser[type][cur.id]

      if (target) {
        acc.push({
          title: cur.data.title,
          labels: cur.list.map((k) => ({
            title: type === "choices" ? k.value : k.data.title,
            description: k.data?.description,
            src: k?.src,
            count: target[k.id] ?? 0,
          })),
        })
      }
      return acc
    }, [] as SelectChartType[])

const InsightPage = () => {
  const { pageId, user } = usePageValidator({ isAuth: true })

  const { modal, setModal } = useMainStore()
  const onClickMain = (e: any) => {
    const closestElement = e.target.closest("[data-global-closer]")

    if (!closestElement && modal.type) {
      setModal({ section: null, type: null }) // main store (유저용)
    }
  }

  const { data: pageData, isSuccess } = useQuery<InsightPageType>({
    queryKey: queryKey.insight(pageId),
    queryFn: () => getInsight(pageId),
    enabled: !!user?.userId,
  })

  const { isSelectDisplay, isCalendarDisplay, isTimeDisplay, isChoicesDisplay, formSectionTypes } = useMemo(() => {
    if (!pageData?.content?.formSections) return {}
    const formSectionTypes = pageData.content.formSections
      .filter((v) => ["calendar", "select", "choices", "time", "nameInput", "phone", "email"].includes(v.type))
      .map((v) => v.type)

    return {
      isSelectDisplay: formSectionTypes.includes("select"),
      isCalendarDisplay: formSectionTypes.includes("calendar"),
      isTimeDisplay: formSectionTypes.includes("time"),
      isChoicesDisplay: formSectionTypes.includes("choices"),
      formSectionTypes: formSectionTypes ?? [],
    }
  }, [pageData?.content?.formSections])

  const { submitInitialTarget, calenderInitialTarget } = useMemo(() => {
    if (!pageData) return {}
    const analyser = pageData.analyser
    return {
      submitInitialTarget: Object.keys(analyser.submit)[0],
      calenderInitialTarget: Object.keys(analyser.calendar)[0],
    }
  }, [pageData?.analyser])

  const selectChartArr: SelectChartType[] = useMemo(() => {
    if (isSelectDisplay && !!pageData?.analyser) {
      return getChartArr("select", pageData)
    } else {
      return []
    }
  }, [isSelectDisplay, pageData?.analyser])

  const choicesChartArr: SelectChartType[] = useMemo(() => {
    if (isChoicesDisplay && !!pageData?.analyser) {
      return getChartArr("choices", pageData)
    } else {
      return []
    }
  }, [isChoicesDisplay, pageData?.analyser])

  return (
    user && (
      <div onClick={onClickMain} className={cx("page")}>
        {isSuccess && pageData ? (
          <div className={cx("page-inner")}>
            <div className={cx("content")}>
              <div className={cx("background")}></div>
              <PageInfo pageData={pageData} user={user} />
              <div className={cx("charts")}>
                {submitInitialTarget && (
                  <SubmitChart
                    data={pageData.analyser.submit}
                    initialTarget={submitInitialTarget}
                    lang={pageData.lang}
                  />
                )}
                {calenderInitialTarget && isCalendarDisplay && (
                  <CalendarChart
                    data={pageData.analyser.calendar}
                    initialTarget={calenderInitialTarget}
                    lang={pageData.lang}
                  />
                )}
                {isTimeDisplay && <TimeChart data={pageData.analyser.time} />}
                {isSelectDisplay && <SelectListChart selectChartArr={selectChartArr} />}
                {isChoicesDisplay && <SelectListChart selectChartArr={choicesChartArr} />}
              </div>
            </div>
            <ConfirmationList formSectionTypes={formSectionTypes} list={pageData.confirmation} />
          </div>
        ) : (
          <PageLoading isLoading={true} />
        )}
      </div>
    )
  )
}

export default InsightPage
