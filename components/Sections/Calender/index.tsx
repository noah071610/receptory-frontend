"use client"

import FormUserInput from "@/components/FormUserInput"
import CalenderMain from "@/components/Modal/DatePicker/CalenderMain"
import NumberRange from "@/components/NumberRange"
import OptionBar from "@/components/Options/OptionBar"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import setDateFormat from "@/utils/helpers/setDate"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { DatePickerStateProvider } from "@rehookify/datepicker"
import { memo, useEffect, useState } from "react"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
const cx = cs.bind(style)

function Calender({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const {
    setModal,
    date: { selectedStartDate, selectedEndDate },
  } = useMainStore()
  const { setOptions, addCollection, deleteCollection, saveSectionHistory } = useEditorStore()
  const { isAlways, specificDate, selectRange, startDate, endDate } = section.options

  const [tempDateForSpecificDate, setTempDateForSpecificDate] = useState<Date[]>([])
  const [minMaxDate, setMinMaxDate] = useState<Date[]>([])

  const onChangeMinMaxDate = (d: Date[]) => {
    setMinMaxDate(d)
    if (d.length > 1) {
      setOptions({ payload: d[0], key: "startDate" })
      setOptions({ payload: d[1], key: "endDate" })
      saveSectionHistory()
    }
  }

  const onChangeSpecificDate = (d: Date[]) => {
    setTimeout(() => {
      if (selectRange === "single") {
        // 싱글이면 걍 추가 EASY
        addCollection({
          payload: {
            specificStartDate: d[0],
            specificEndDate: null,
          },
        })
      } else {
        if (d.length > 1) {
          // 길이가 하나 이상? 즉 range가 끝나는 시점임. 콜렉션 추가
          addCollection({
            payload: {
              specificStartDate: d[0],
              specificEndDate: d[1],
            },
          })
          setTempDateForSpecificDate([])
        } else {
          // 아직 range를 선택중이니 저장해주고 기다리자...!
          setTempDateForSpecificDate(d)
        }
      }
    }, 0)
  }

  const onClickDeleteSelectDate = (i: number) => {
    setTimeout(() => {
      deleteCollection({ targetIndex: i })
    }, 0)
  }

  const onClickOpenModal = () => {
    setModal({ section, type: specificDate ? "dateSelect" : "date" })
  }

  useEffect(() => {
    if (isAlways) {
      setMinMaxDate([])
      setOptions({ payload: undefined, key: "startDate" })
      setOptions({ payload: undefined, key: "endDate" })
    }
  }, [isAlways])

  useEffect(() => {
    if (startDate && endDate) {
      setMinMaxDate([startDate, endDate])
    } else {
      setMinMaxDate([])
    }
  }, [startDate, endDate])

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faCalendar}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
      >
        {!selectedStartDate && t("날짜 입력")}
        {selectedStartDate && (
          <span>{selectedStartDate === "anyDate" ? t("anyDate") : setDateFormat(selectedStartDate, lang)}</span>
        )}
        {selectedEndDate && <span>{" ~ "}</span>}
        {selectedEndDate && <span>{setDateFormat(selectedEndDate, lang)}</span>}
      </FormUserInput>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <OptionBar section={section} value="specificDate" />
        <OptionBar section={section} value="addAnyDate" />
        <OptionRatio optionsArr={["single", "range"]} section={section} targetKey="selectRange" />
        {!specificDate && (
          <>
            <OptionBar section={section} value="isAlways" />
            {!isAlways && (
              <div className={cx("option-date-picker")}>
                <h4>{t("selectMinMaxDate")}</h4>
                <DatePickerStateProvider
                  config={{
                    selectedDates: minMaxDate,
                    onDatesChange: onChangeMinMaxDate,
                    dates: {
                      minDate: new Date(),
                      mode: "range",
                      toggle: true,
                    },
                  }}
                >
                  <CalenderMain section={section} isOptionCalender={true} />
                </DatePickerStateProvider>
              </div>
            )}
          </>
        )}
        {specificDate && (
          <>
            <div className={cx("option-date-picker")}>
              <h4>{t("selectDate")}</h4>
              <DatePickerStateProvider
                config={{
                  selectedDates: selectRange === "single" ? [] : tempDateForSpecificDate,
                  onDatesChange: onChangeSpecificDate,
                  dates: {
                    minDate: new Date(),
                    mode: selectRange === "single" ? "multiple" : "range",
                    toggle: true,
                  },
                }}
              >
                <CalenderMain section={section} isOptionCalender={true} />
              </DatePickerStateProvider>
            </div>
            <ul className={cx("dates")}>
              {section.collection.map(({ specificStartDate, specificEndDate }, i) => (
                <li key={`specific_date_${i}`}>
                  <button onClick={() => onClickDeleteSelectDate(i)}>
                    <NumberRange
                      start={specificStartDate}
                      end={specificEndDate}
                      formatter={(date: Date) => {
                        return setDateFormat(date, lang)
                      }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!specificDate && (
          <OptionRatio optionsArr={["all", "everyWeekdays", "everyWeekend"]} section={section} targetKey="interval" />
        )}
      </div>
    </div>
  )
}

export default memo(Calender)
