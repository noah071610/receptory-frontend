"use client"

import Input from "@/components/Input"
import OptionBar from "@/components/Options/OptionBar"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { DatePickerStateProvider } from "@rehookify/datepicker"
import classNames from "classNames"
import dayjs from "dayjs"
import { memo, useEffect, useState } from "react"
import DatePicker from "./DatePicker"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Calender({ section }: { section: SectionType }) {
  const { setOptions } = useEditorStore()
  const isMultipleDate = section.design !== "single"
  const isAlways = section.options.isAlways
  const [startDate, endDate] = [section.options.startDate, section.options.endDate]

  const [selectedDates, onDatesChange] = useState<Date[]>([])
  const [offsetDate, onOffsetChange] = useState<Date>(startDate)

  const onChangeDate = (e: any, type: string) => {
    setOptions({ payload: dayjs(e.target.value).toDate(), key: type })
  }

  useEffect(() => {
    onDatesChange([])
    onOffsetChange(startDate)
  }, [section.design, startDate, endDate])

  useEffect(() => {
    if (isAlways) {
      onDatesChange([])
      onOffsetChange(new Date())
      setOptions({ payload: new Date(), key: "startDate" })
      setOptions({ payload: undefined, key: "endDate" })
    }
  }, [isAlways])

  return (
    <div className={cx(style["layout"])}>
      <Input className={cx(style.title)} inputType="calender" isOptional={true} value={section.value} />

      <DatePickerStateProvider
        config={{
          selectedDates,
          onDatesChange,
          offsetDate,
          onOffsetChange,
          dates: {
            mode: isMultipleDate ? "range" : "single",
            minDate: startDate,
            maxDate: endDate,
            selectSameDate: true,
          },
          time: {
            interval: 15,
          },
        }}
      >
        <DatePicker startDate={startDate} />
      </DatePickerStateProvider>
      <div className={cx(style.options)}>
        <OptionBar section={section} value="isAlways" />
        <div className={cx(style.date, { [style.isAlways]: isAlways })}>
          <h4 className={cx(style["date-title"])}>startDate</h4>
          <input
            disabled={isAlways}
            onChange={(e) => onChangeDate(e, "startDate")}
            value={dayjs(startDate).format("YYYY-MM-DD")}
            type="date"
          />
        </div>
        <div className={cx(style.date, { [style.isAlways]: isAlways })}>
          <h4 className={cx(style["date-title"])}>endDate</h4>
          <input
            disabled={isAlways}
            onChange={(e) => onChangeDate(e, "endDate")}
            value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined}
            type="date"
          />
        </div>
      </div>
    </div>
  )
}

export default memo(Calender)
