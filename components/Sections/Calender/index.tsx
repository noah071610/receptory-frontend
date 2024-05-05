"use client"

import FormTitle from "@/components/FormTitle"
import CalenderMain from "@/components/Modal/DatePicker/CalenderMain"
import OptionBar from "@/components/Options/OptionBar"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { DatePickerStateProvider } from "@rehookify/datepicker"
import classNames from "classNames"
import dayjs from "dayjs"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Calender({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setOptions, setActive } = useEditorStore()
  const { isAlways, startDate, endDate, interval, selectedSpecificDates } = section.options
  const [selectedTime, selectedEndTime] = [
    section.value[0],
    section.value.length <= 1 ? undefined : section.value[section.value.length - 1],
  ]

  const onChangeDate = (e: any, type: string) => {
    setOptions({ payload: dayjs(e.target.value).toDate(), key: type })
  }

  const onDatesChange = (d: Date[]) => {
    setOptions({
      key: "selectedSpecificDates",
      payload: d.toSorted((a, b) => {
        if (a > b) return -1
        if (a < b) return 1
        return 0
      }),
    })
  }

  const toggleSelect = () => {
    setTimeout(() => {
      setActive({
        key: "modal",
        payload: { type: interval === "specificDate" ? "calender-select" : "calender", payload: selectedSpecificDates },
      })
    }, 0)
  }

  return (
    <div className={cx(style["layout"])}>
      <FormTitle section={section} />
      <button onClick={toggleSelect} className={cx(style["date-select-btn"])}>
        {!selectedTime && t("날짜를 입력해주세요")}
        {selectedTime && <span>{dayjs(selectedTime).format("DD-MM-YYYY")}</span>}
        {selectedEndTime && <span>{" ~ "}</span>}
        {selectedEndTime && <span>{dayjs(selectedEndTime).format("DD-MM-YYYY")}</span>}
      </button>
      {!isDisplayMode && (
        <div className={cx(style.options)}>
          <OptionTitleInputs section={section} />
          <OptionBar section={section} value="isAlways" />
          {!isAlways && (
            <>
              <div className={cx(style.date)}>
                <h4 className={cx(style["date-title"])}>startDate</h4>
                <input
                  onChange={(e) => onChangeDate(e, "startDate")}
                  value={dayjs(startDate).format("YYYY-MM-DD")}
                  type="date"
                />
              </div>
              <div className={cx(style.date)}>
                <h4 className={cx(style["date-title"])}>endDate</h4>
                <input
                  onChange={(e) => onChangeDate(e, "endDate")}
                  value={endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined}
                  type="date"
                />
              </div>
            </>
          )}

          <OptionRatio optionsArr={["single", "range"]} section={section} targetKey="selectRange" />
          <OptionRatio
            optionsArr={["all", "everyWeekdays", "everyWeekend", "specificDate"]}
            section={section}
            targetKey="interval"
          />
          {interval === "specificDate" && (
            <DatePickerStateProvider
              config={{
                selectedDates: selectedSpecificDates,
                onDatesChange,
                dates: {
                  minDate: new Date(),
                  mode: "multiple",
                  toggle: true,
                },
              }}
            >
              <CalenderMain isSpecificDatePicker={true} />
            </DatePickerStateProvider>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Calender)
