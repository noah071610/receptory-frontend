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
import PageInfo from "@/containers/insight-page/PageInfo"
import { usePageValidator } from "@/hooks/usePageValidator"
import UserPageLayout from "@/layout/UserPageLayout"
import { InsightPageType } from "@/types/Insight"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
const cx = cs.bind(style)

const InsightPage = () => {
  const { pageId, user } = usePageValidator({ isAuth: true })

  const { data: pageData, isSuccess } = useQuery<InsightPageType>({
    queryKey: queryKey.insight(pageId),
    queryFn: () => getInsight(pageId),
    enabled: !!user?.userId,
  })

  const {
    submitInitialTarget,
    calenderInitialTarget,
    isSelectDisplay,
    isCalendarDisplay,
    isTimeDisplay,
    isChoicesDisplay,
  } = useMemo(() => {
    if (!pageData) return {}
    const formSectionTypes = pageData.content.formSections
      .filter((v) => !["text", "title", "callout", "checkList", "thumbnail"].includes(v.type))
      .map((v) => v.type)

    const analyser = pageData.analyser
    return {
      submitInitialTarget: Object.keys(analyser.submit)[0],
      calenderInitialTarget: Object.keys(analyser.calendar)[0],
      isSelectDisplay: formSectionTypes.includes("select"),
      isCalendarDisplay: formSectionTypes.includes("calendar"),
      isTimeDisplay: formSectionTypes.includes("time"),
      isChoicesDisplay: formSectionTypes.includes("choices"),
    }
  }, [pageData?.analyser])

  return (
    user && (
      <UserPageLayout>
        {isSuccess && pageData ? (
          <>
            <PageInfo pageData={pageData} user={user} />
            <div className={cx("list")}>
              {submitInitialTarget && (
                <SubmitChart data={pageData.analyser.submit} initialTarget={submitInitialTarget} lang={pageData.lang} />
              )}
              {calenderInitialTarget && isCalendarDisplay && (
                <CalendarChart
                  data={pageData.analyser.calendar}
                  initialTarget={calenderInitialTarget}
                  lang={pageData.lang}
                />
              )}
              {isTimeDisplay && <TimeChart data={pageData.analyser.time} />}
              {isSelectDisplay && <SelectListChart data={pageData.analyser.select} />}
              {isChoicesDisplay && <SelectListChart data={pageData.analyser.choices} />}
            </div>
          </>
        ) : (
          <PageLoading isLoading={true} />
        )}
      </UserPageLayout>
    )
  )
}

export default InsightPage
