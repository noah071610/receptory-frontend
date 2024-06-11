"use client"

import { SectionType } from "@/types/Edit"
import { DPDayInteger, DatePickerStateProvider } from "@rehookify/datepicker"
import { useMemo, useState } from "react"
import ModalLayout from ".."
import CalenderMain from "./CalenderMain"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

export const DatePicker = ({ section }: { section: SectionType }) => {
  const { startDate, endDate, interval, specificDate, isRangeSelect } = section.options
  const sd = useMemo(() => section?.collection ?? [], [section?.collection])

  // 특정 날짜를 선택하기 위한 달력, 엄연히 에디터 사용 유저들을 위한 로직
  // 실제 이용자들은 쓸일이 없다.
  const startDateForSpecific = useMemo(() => {
    if (!specificDate || sd?.length < 1) return []
    return sd.toSorted((a, b) => {
      if (a.specificStartDate > b.specificStartDate) return -1
      if (a.specificStartDate < b.specificStartDate) return 1
      return 0
    })[0].specificStartDate
  }, [sd, specificDate])
  const endDateForSpecific = useMemo(() => {
    if (!specificDate || sd?.length < 1) return []
    return sd.toSorted((a, b) => {
      if (a.specificEndDate > b.specificEndDate) return 1
      if (a.specificEndDate < b.specificEndDate) return -1
      return 0
    })[0].specificEndDate
  }, [sd, specificDate])

  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(startDate)

  const excludeDays: DPDayInteger[] | undefined = useMemo(() => {
    switch (interval) {
      case "all":
        return undefined
      case "everyWeekdays":
        return [0, 6]
      case "everyWeekend":
        return [1, 2, 3, 4, 5]
      default:
        return [0, 1, 2, 3, 4, 5, 6]
    }
  }, [interval])

  return (
    <ModalLayout modalStyle={cx("modal")}>
      {section && (
        <DatePickerStateProvider
          config={{
            selectedDates,
            onDatesChange,
            offsetDate,
            onOffsetChange,
            dates: {
              mode: isRangeSelect ? "range" : "single",
              minDate: specificDate ? startDateForSpecific : startDate,
              maxDate: specificDate ? endDateForSpecific : endDate,
              toggle: !isRangeSelect,
            },
            exclude: {
              day: excludeDays,
            },
          }}
        >
          <CalenderMain section={section} selectedDates={selectedDates} />
        </DatePickerStateProvider>
      )}
    </ModalLayout>
  )
}

export default DatePicker
