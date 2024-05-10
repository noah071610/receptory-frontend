"use client"

import { SectionType } from "@/types/Edit"
import { DPDayInteger, DatePickerStateProvider } from "@rehookify/datepicker"
import { useMemo, useState } from "react"
import ModalLayout from ".."
import CalenderMain from "./CalenderMain"

export const DatePicker = ({ section }: { section: SectionType }) => {
  const { startDate, endDate, interval, specificDate, selectRange } = section.options
  const specificDateCollection = section?.collection ?? []

  const startDateForSpecific = useMemo(() => {
    if (specificDateCollection?.length < 1) return []
    return specificDateCollection.toSorted((a, b) => {
      if (a.specificStartDate > b.specificStartDate) return -1
      if (a.specificStartDate < b.specificStartDate) return 1
      return 0
    })[0].specificStartDate
  }, [specificDateCollection])
  const endDateForSpecific = useMemo(() => {
    if (specificDateCollection?.length < 1) return []
    return specificDateCollection.toSorted((a, b) => {
      if (a.specificEndDate > b.specificEndDate) return 1
      if (a.specificEndDate < b.specificEndDate) return -1
      return 0
    })[0].specificEndDate
  }, [specificDateCollection])

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
    <ModalLayout>
      {section && (
        <DatePickerStateProvider
          config={{
            selectedDates,
            onDatesChange,
            offsetDate,
            onOffsetChange,
            dates: {
              mode: selectRange,
              minDate: specificDate ? startDateForSpecific : startDate,
              maxDate: specificDate ? endDateForSpecific : endDate,
              toggle: selectRange !== "range",
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
