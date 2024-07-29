"use client"

import cs from "classnames/bind"
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
import { useInitTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { InsightPageType, SelectChartType } from "@/types/Insight"
import { Langs } from "@/types/Main"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
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
            id: k.id,
            title: type === "choices" ? k.value : k.data.title,
            description: k.data?.description,
            src: k?.src,
            count: target[k.id] ?? 0,
          })),
        })
      }
      return acc
    }, [] as SelectChartType[])

const InsightPage = ({ lang }: { lang: Langs }) => {
  const {} = useInitTranslation(lang, ["insight-page", "messages", "modal"])
  const { pageId, user } = usePageValidator({ isAuth: true })

  const { modal, setModal } = useMainStore(["modal", "setModal"])
  const [selectedSection, setSelectedSection] = useState<"insight" | "list">("insight")

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

  const { isSelectDisplay, isCalendarDisplay, isTimeDisplay, isChoicesDisplay, formSections } = useMemo(() => {
    if (!pageData?.content?.formSections) return {}
    const formSections = pageData.content.formSections.filter((v) =>
      ["calendar", "select", "choices", "time"].includes(v.type)
    )

    const types = formSections.map((v) => v.type)

    return {
      isSelectDisplay: types.includes("select"),
      isCalendarDisplay: types.includes("calendar"),
      isTimeDisplay: types.includes("time"),
      isChoicesDisplay: types.includes("choices"),
      formSections: formSections ?? [],
    }
  }, [pageData?.content?.formSections])

  const { submitInitialTarget, calenderInitialTarget } = useMemo(() => {
    if (!pageData) return {}
    const analyser = pageData.analyser
    return {
      submitInitialTarget: analyser?.submit?.map ? Object.keys(analyser.submit.map)[0] : undefined,
      calenderInitialTarget: analyser?.calendar?.map ? Object.keys(analyser.calendar.map)[0] : undefined,
    }
  }, [pageData])

  const selectChartArr: SelectChartType[] = useMemo(() => {
    if (isSelectDisplay && !!pageData?.analyser?.select) {
      return getChartArr("select", pageData)
    } else {
      return []
    }
  }, [isSelectDisplay, pageData])

  const choicesChartArr: SelectChartType[] = useMemo(() => {
    if (isChoicesDisplay && !!pageData?.analyser?.choices) {
      return getChartArr("choices", pageData)
    } else {
      return []
    }
  }, [isChoicesDisplay, pageData])

  return (
    user && (
      <div onClick={onClickMain} className={cx("page")}>
        {isSuccess && pageData ? (
          <div className={cx("page-inner")}>
            <div className={cx("content")}>
              <div className={cx("background")}></div>
              <PageInfo selectedSection={selectedSection} setSelectedSection={setSelectedSection} pageData={pageData} />
              {
                <div className={cx("charts", { isHide: selectedSection !== "insight" })}>
                  <SubmitChart data={pageData.analyser.submit.map} initialTarget={submitInitialTarget} />
                  {isCalendarDisplay && (
                    <CalendarChart
                      anyDateCount={pageData.analyser.calendar.anyDate}
                      data={pageData.analyser.calendar.map}
                      initialTarget={calenderInitialTarget}
                    />
                  )}
                  {isTimeDisplay && (
                    <TimeChart anytimeCount={pageData.analyser.time.anytime} data={pageData.analyser.time.map} />
                  )}
                  {isSelectDisplay && <SelectListChart sectionName="select" selectChartArr={selectChartArr} />}
                  {isChoicesDisplay && <SelectListChart sectionName="choices" selectChartArr={choicesChartArr} />}
                </div>
              }
            </div>
            <ConfirmationList
              setSelectedSection={setSelectedSection}
              isVisible={selectedSection === "list"}
              formSections={formSections}
            />
          </div>
        ) : (
          <PageLoading isLoading={true} />
        )}
      </div>
    )
  )
}

export default InsightPage
