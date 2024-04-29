"use client"

import classNames from "classNames"
import { FC, ReactNode } from "react"

import { useEditorStore } from "@/store/editor"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  DPCalendar,
  useContextCalendars,
  useContextDatePickerOffsetPropGetters,
  useContextDaysPropGetters,
} from "@rehookify/datepicker"
import style from "./style.module.scss"

const cx = classNames.bind(style)

interface CalendarProps {
  prevButton?: ReactNode
  nextButton?: ReactNode
  calendar: DPCalendar
}

const CalenderComponent: FC<CalendarProps> = ({ prevButton, nextButton, calendar }) => {
  const { setActive } = useEditorStore()
  const { weekDays } = useContextCalendars()
  const { dayButton } = useContextDaysPropGetters()
  const { days, month } = calendar

  return (
    <div className={cx(style["date-picker"])}>
      <div className={cx(style.header)}>
        {prevButton || <div />}
        <p>{month}</p>
        {nextButton || <div />}
      </div>
      <div className={cx(style.week)}>
        {weekDays.map((d, i) => (
          <p key={`weeks-${i}`}>{d}</p>
        ))}
      </div>
      <div className={cx(style.main)}>
        {days.map((d) => {
          return (
            <button
              className={cx(style[d.range], {
                [style.active]: d.active,
                [style.selected]: d.selected,
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

function DatePicker({ startDate }: { startDate: Date }) {
  const { calendars } = useContextCalendars()
  const { addOffset, subtractOffset, setOffset } = useContextDatePickerOffsetPropGetters()

  // useEffect(() => {
  //   setOffset(startDate)
  // }, [startDate])

  return (
    <div className={cx(style["date-picker-layout"])}>
      {/* <h1>
        {start ? start : "..."}&nbsp; - &nbsp;{end ? end : "..."}
      </h1> */}
      <div className={cx(style["content-wrapper"])}>
        <CalenderComponent
          prevButton={
            <button className={cx(style.prev)} {...subtractOffset({ months: 1 })}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          }
          nextButton={
            <button className={cx(style.next)} {...addOffset({ months: 1 })}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          }
          calendar={calendars[0]}
        />
      </div>
    </div>
  )
}

export default DatePicker
