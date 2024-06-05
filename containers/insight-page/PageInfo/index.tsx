"use client"

import { noImageUrl } from "@/config"
import { useMainStore } from "@/store/main"
import { InsightPageType } from "@/types/Insight"
import { UserType } from "@/types/User"
import hasString from "@/utils/helpers/hasString"
import { DatePickerStateProvider, useContextCalendars, useContextDaysPropGetters } from "@rehookify/datepicker"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import cs from "classNames/bind"
import { useRouter } from "next/navigation"
import { FC, useLayoutEffect, useMemo, useState } from "react"
import { Bar } from "react-chartjs-2"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}일`)

interface CalendarProps {
  calendar: any
}

function CalenderMain({
  curCalendarDate,
  calendarChartArr,
}: {
  curCalendarDate: string | null
  calendarChartArr: number[]
}) {
  const { calendars } = useContextCalendars()

  const calender = useMemo(
    () => ({
      month: calendars[0].month,
      days: calendars[0].days.map((v) => ({ ...v, count: v.inCurrentMonth ? calendarChartArr[parseInt(v.day)] : 0 })),
      year: calendars[0].year,
    }),
    [calendars[0], calendarChartArr]
  )

  return <CalenderComponent calendar={calender} />
}

const CalenderComponent: FC<CalendarProps> = ({ calendar }) => {
  const { weekDays } = useContextCalendars()
  const { dayButton } = useContextDaysPropGetters()
  const { days, month } = calendar

  return (
    <div className={cx("date-picker")}>
      <div className={cx("header")}>
        <p>{month}</p>
      </div>
      <div className={cx("week")}>
        {weekDays.map((d, i) => (
          <p key={`weeks-${i}`}>{d}</p>
        ))}
      </div>
      <div className={cx("main")}>
        {days.map((d: any) => {
          return (
            <button
              className={cx(d.range, {
                active: d.count > 0,
              })}
              key={d.$date.toString()}
              {...dayButton(d)}
            >
              {d.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

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
      setCalendarChartArr(pageData.analyser.calendar[yearMonth])
    } else {
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
  }, [yearMonthArr])

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
        <div className={cx("analytics")}>
          <div className={cx("chart-wrapper")}>
            <h2>
              <span>접수 현황</span>
            </h2>
            <Swiper className={cx("yearMonth-slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
              {yearMonthArr.map((yearMonth) => {
                return (
                  <SwiperSlide className={cx("yearMonth-slide")} key={`menu_${yearMonth}`}>
                    <button
                      className={cx({ active: curSubmitDate === yearMonth })}
                      onClick={() => onClickSubmitChartMenu("submit", yearMonth)}
                      key={`${yearMonth}`}
                    >
                      <span>{yearMonth}</span>
                    </button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <div className={cx("chart-inner")}>
              <div className={cx("chart")}>
                <Bar
                  options={{
                    indexAxis: "x" as const,
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                      bar: {
                        borderWidth: 1,
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                  data={data}
                />
              </div>
            </div>
          </div>

          {/* calendar */}

          <div className={cx("chart-wrapper")}>
            <h2>
              <span>캘린더</span>
            </h2>
            <Swiper className={cx("yearMonth-slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
              {yearMonthArr.map((yearMonth) => {
                return (
                  <SwiperSlide className={cx("yearMonth-slide")} key={`menu_${yearMonth}`}>
                    <button
                      className={cx({ active: curSubmitDate === yearMonth })}
                      onClick={() => onClickSubmitChartMenu("calendar", yearMonth)}
                      key={`${yearMonth}`}
                    >
                      <span>{yearMonth}</span>
                    </button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <div className={cx("calendar-inner")}>
              <div className={cx("calendar")}>
                <DatePickerStateProvider
                  config={{
                    offsetDate: curCalendarDate ? new Date(curCalendarDate) : undefined,
                    selectedDates: [],
                    onDatesChange: () => {},
                  }}
                >
                  <CalenderMain curCalendarDate={curCalendarDate} calendarChartArr={calendarChartArr} />
                </DatePickerStateProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageInfo
