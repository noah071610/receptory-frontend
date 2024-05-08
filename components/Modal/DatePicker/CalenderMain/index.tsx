"use client"

import { FC, ReactNode, useEffect } from "react"

import { useTranslation } from "@/i18n/client"
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

import cs from "classNames/bind"
const cx = cs.bind(style)

interface CalendarProps {
  prevButton?: ReactNode
  nextButton?: ReactNode
  calendar: DPCalendar
}

const CalenderComponent: FC<CalendarProps> = ({ prevButton, nextButton, calendar }) => {
  const { weekDays } = useContextCalendars()
  const { dayButton } = useContextDaysPropGetters()
  const { days, month } = calendar

  return (
    <div className={cx("date-picker")}>
      <div className={cx("header")}>
        {prevButton || <div />}
        <p>{month}</p>
        {nextButton || <div />}
      </div>
      <div className={cx("week")}>
        {weekDays.map((d, i) => (
          <p key={`weeks-${i}`}>{d}</p>
        ))}
      </div>
      <div className={cx("main")}>
        {days.map((d) => {
          return (
            <button
              className={cx(d.range, {
                active: d.active,
                selected: d.selected,
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

function CalenderMain({ isOptionCalender, selectedDates }: { isOptionCalender?: boolean; selectedDates?: Date[] }) {
  const { t } = useTranslation()
  const { selectedSection, setValue, setActive } = useEditorStore()
  const { calendars } = useContextCalendars()
  const { addOffset, subtractOffset, setOffset } = useContextDatePickerOffsetPropGetters()
  const { options } = selectedSection ?? {}
  const { startDate, addAnyDate, selectRange } = options ?? {}
  const inactiveBtn = !selectedDates || selectedDates.length <= (selectRange === "range" ? 1 : 0)

  const onClickSubmit = () => {
    if (!selectedDates || selectedDates.length <= 0) return
    setValue({
      payload: {
        selectedStartDate: selectedDates[0],
        selectedEndDate: selectedDates[1], // undefined 도 가능
      },
    })
    setActive({ key: "modal", payload: { type: null } })
  }
  const onClickAnyDate = () => {
    setValue({
      payload: {
        selectedStartDate: "anyDate",
        selectedEndDate: undefined,
      },
    })
    setActive({ key: "modal", payload: { type: null } })
  }

  useEffect(() => {
    if (!isOptionCalender) setOffset(startDate)
  }, [startDate, isOptionCalender])

  return (
    <div className={cx("date-picker-layout", { isOptionCalender: isOptionCalender })}>
      <div className={cx("content-wrapper")}>
        <CalenderComponent
          prevButton={
            <button className={cx("prev")} {...subtractOffset({ months: 1 })}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          }
          nextButton={
            <button className={cx("next")} {...addOffset({ months: 1 })}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          }
          calendar={calendars[0]}
        />
      </div>
      {!isOptionCalender && (
        <>
          <div className={cx("btn-wrapper")}>
            <button className={cx("pickDate")} disabled={inactiveBtn} onClick={onClickSubmit}>
              <span>{t("pickDate")}</span>
            </button>
            {addAnyDate && (
              <button className={cx("anyDate")} onClick={onClickAnyDate}>
                <span>{t("pickAnyDate")}</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CalenderMain
