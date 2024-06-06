"use client"

import { noImageUrl } from "@/config"
import { useMainStore } from "@/store/main"
import { InsightPageType } from "@/types/Insight"
import { UserType } from "@/types/User"
import hasString from "@/utils/helpers/hasString"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js"
import cs from "classNames/bind"
import { useRouter } from "next/navigation"
import { useLayoutEffect, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip)

const PageInfo = ({ user, pageData }: { user: UserType; pageData: InsightPageType }) => {
  const yearMonthArr = Object.keys(pageData.analyser.submit)
  const calendarYearMonthArr = Object.keys(pageData.analyser.calendar)

  const { push } = useRouter()
  const { setModal } = useMainStore()
  const [curSubmitDate, setCurSubmitDate] = useState<null | string>(null)
  const [submitChartArr, setSubmitChartArr] = useState<number[]>([])
  const [curCalendarDate, setCurCalendarDate] = useState<null | string>(null)
  const [calendarChartArr, setCalendarChartArr] = useState<number[]>([])

  const data = {
    labels: submitChartArr.map((_, i) => `${i + 1}일`),
    datasets: [
      {
        label: "접수 수",
        data: submitChartArr.map(() => Math.floor(Math.random() * 100) + 1),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const onClickSubmitChartMenu = (type: "calendar" | "submit", yearMonth: string) => {
    if (type === "calendar") {
      setCurCalendarDate(yearMonth)
      setCalendarChartArr(pageData.analyser.calendar[yearMonth])
    } else {
      setCurSubmitDate(yearMonth)
      setSubmitChartArr(pageData.analyser.submit[yearMonth])
    }
  }

  useLayoutEffect(() => {
    if (yearMonthArr?.length > 0) {
      const initial = yearMonthArr[0]
      setCurSubmitDate(initial)
      setSubmitChartArr(pageData.analyser.submit[initial])
    }
    if (calendarYearMonthArr?.length > 0) {
      const initial = calendarYearMonthArr[0]
      setCurCalendarDate(initial)
      setCalendarChartArr(pageData.analyser.calendar[initial])
    }
  }, [yearMonthArr?.length, calendarYearMonthArr?.length])

  return (
    <>
      <div className={cx("page-info")}>
        <picture>
          <img
            src={hasString(pageData.thumbnail) ? pageData.thumbnail : noImageUrl}
            alt={`${pageData.pageId}_thumbnail`}
          />
        </picture>
        <h1>{pageData.title}</h1>
        {hasString(pageData.description) && <span className={cx("description")}>{pageData.description}</span>}
      </div>
    </>
  )
}

export default PageInfo
