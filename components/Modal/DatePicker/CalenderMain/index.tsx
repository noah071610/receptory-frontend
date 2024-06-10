"use client"

import { FC, ReactNode, useEffect } from "react"

import { useTranslation } from "@/i18n/client"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  DPCalendar,
  useContextCalendars,
  useContextDatePickerOffsetPropGetters,
  useContextDaysPropGetters,
} from "@rehookify/datepicker"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import { dateToString } from "@/utils/helpers/setDate"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
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

function CalenderMain({
  section,
  isOptionCalender,
  selectedDates,
}: {
  section: SectionType
  isOptionCalender?: boolean
  selectedDates?: Date[]
}) {
  const { lang } = useParams()
  const { pageLang, setSelected, setModal } = useMainStore(["pageLang", "setModal", "setSelected"])
  const { t } = useTranslation(pageLang, ["edit-page"])
  const { calendars } = useContextCalendars()
  const { addOffset, subtractOffset, setOffset } = useContextDatePickerOffsetPropGetters()
  const { startDate, addAnyDate, isRangeSelect } = section.options
  const inactiveBtn = !selectedDates || selectedDates.length <= (isRangeSelect ? 1 : 0)

  const onClickSubmit = () => {
    if (!selectedDates || selectedDates.length <= 0) return

    const arr = selectedDates.map((v, i) => ({
      key: i === 0 ? "startDate" : "endDate",
      text: dateToString(v),
    }))
    setSelected({
      section,
      value: arr,
    })
    setModal({ section: null, type: null })
  }
  const onClickAnyDate = () => {
    setSelected({
      section,
      value: [{ key: "anyDate", text: t("anyDate") }],
    })
    setModal({ section: null, type: null })
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
