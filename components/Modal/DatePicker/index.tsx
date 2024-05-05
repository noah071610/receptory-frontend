"use client"

import { useEditorStore } from "@/store/editor"

import { DPDayInteger, DatePickerStateProvider } from "@rehookify/datepicker"
import { useEffect, useMemo, useState } from "react"
import ModalLayout from ".."
import CalenderMain from "./CalenderMain"

export const DatePicker = () => {
  const { selectedSection, setOptions } = useEditorStore()

  const { options } = selectedSection ?? {}
  const { startDate, endDate, isAlways, interval, selectRange, selectedSpecificDates } = options ?? {}

  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(startDate)

  const [startDateForSpecific, endDateForSpecific] = [
    selectedSpecificDates[0],
    selectedSpecificDates[selectedSpecificDates.length - 1],
  ]

  useEffect(() => {
    onDatesChange([])
    onOffsetChange(interval === "specificDate" ? startDateForSpecific : startDate)
  }, [selectRange, startDate, endDate, selectedSpecificDates, interval])

  useEffect(() => {
    if (isAlways) {
      onDatesChange([])
      onOffsetChange(new Date())
      setOptions({ payload: new Date(), key: "startDate" })
      setOptions({ payload: undefined, key: "endDate" })
    }
  }, [isAlways])

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
      {selectedSection && (
        <DatePickerStateProvider
          config={{
            selectedDates,
            onDatesChange,
            offsetDate,
            onOffsetChange,
            dates: {
              mode: selectRange,
              minDate: interval === "specificDate" ? startDateForSpecific : startDate,
              maxDate: interval === "specificDate" ? endDateForSpecific : endDate,
              toggle: selectRange !== "range",
            },
            exclude: {
              day: excludeDays,
            },
          }}
        >
          <CalenderMain selectedDates={selectedDates} />
        </DatePickerStateProvider>
      )}
    </ModalLayout>
  )
}

export default DatePicker
