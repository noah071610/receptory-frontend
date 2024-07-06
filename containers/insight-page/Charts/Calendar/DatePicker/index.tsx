"use client"

import { useInsightStore } from "@/store/insight"
import { dateToString } from "@/utils/helpers/setDate"
import { useContextCalendars, useContextDaysPropGetters } from "@rehookify/datepicker"
import cs from "classnames/bind"
import { FC, useMemo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

interface CalendarProps {
  calendar: any
}

export function CalenderMain({ calendarChartArr }: { calendarChartArr: number[] }) {
  const { calendars } = useContextCalendars()

  const calender = useMemo(
    () => ({
      month: calendars[0].month,
      days: calendars[0].days.map((v) => ({ ...v, count: v.inCurrentMonth ? calendarChartArr[parseInt(v.day)] : 0 })),
      year: calendars[0].year,
    }),
    [calendarChartArr, calendars]
  )

  return <CalenderComponent calendar={calender} />
}

export const CalenderComponent: FC<CalendarProps> = ({ calendar }) => {
  const { weekDays } = useContextCalendars()
  const { dayButton } = useContextDaysPropGetters()
  const { setCurFilterAll, setIsFilterUpdate } = useInsightStore(["setCurFilterAll", "setIsFilterUpdate"])
  const { days, month } = calendar

  const onClickDate = (date: Date, isPossible: boolean) => {
    if (isPossible) {
      setCurFilterAll({
        startQuery: dateToString(date),
        endQuery: "",
        type: "calendar",
        isAnyDateOrAnytime: false,
      })
      setIsFilterUpdate(true)
    }
  }

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
              onClick={() => onClickDate(d.$date, d.count > 0 && d.inCurrentMonth)}
              className={cx("count-btn")}
              key={d.$date.toString()}
            >
              <div
                className={cx("content", {
                  active: d.count > 0,
                  disabled: !d.inCurrentMonth,
                })}
              >
                {d.day}
              </div>

              {d.count > 0 && (
                <div className={cx("count", { active: d.count > 0 })}>
                  <div className={cx("circle")}></div>
                  <span>{d.count}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
