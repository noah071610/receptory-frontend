"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionBar from "@/components/Options/OptionBar"
import { useTranslation } from "@/i18n/client"
import { _useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { memo, useEffect, useState } from "react"
import style from "./style.module.scss"

import CalenderMain from "@/components/Modal/DatePicker/CalenderMain"
import NumberRange from "@/components/NumberRange"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useMainStore } from "@/store/main"
import { dateToString, stringToDate } from "@/utils/helpers/setDate"
import { DatePickerStateProvider } from "@rehookify/datepicker"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Calender({ section }: { section: SectionType }) {
  const { setModal, setSelected, selected, pageLang } = useMainStore([
    "pageLang",
    "setModal",
    "setSelected",
    "selected",
  ])
  const { t } = useTranslation(pageLang, ["edit-page"])

  const { setOptions, addCollection, deleteCollection, saveSectionHistory, pageOptions } = _useEditorStore()
  const { isAlways, specificDate, isRangeSelect, startDate, endDate } = section.options
  const { value } = selected[section.index - 1] ?? {}

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
      if (!isRangeSelect) {
        // 싱글이면 걍 추가 EASY
        addCollection({
          payload: {
            specificStartDate: dateToString(d[0]),
            specificEndDate: null,
          },
        })
      } else {
        if (d.length > 1) {
          // 길이가 하나 이상? 즉 range가 끝나는 시점임. 콜렉션 추가
          addCollection({
            payload: {
              specificStartDate: dateToString(d[0]),
              specificEndDate: dateToString(d[1]),
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
  }, [isAlways, setOptions])

  useEffect(() => {
    if (startDate && endDate) {
      setMinMaxDate([startDate, endDate])
    } else {
      setMinMaxDate([])
    }
  }, [startDate, endDate])

  const reset = () => {
    setSelected({
      section,
      value: [],
    })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faCalendar}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 ? (
          <NumberRange
            start={value[0].text}
            end={value[1] && value[1].text}
            formatter={(date: string) => {
              if (date === "anyDate") return "anyDate"
              return stringToDate(date, pageOptions.lang)
            }}
          />
        ) : (
          t("none")
        )}
      </FormUserInput>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div className={cx("options-bars")}>
          <h4>
            <span>{t("editDetail")}</span>
          </h4>
          <OptionBar section={section} value="specificDate" />
          {specificDate && (
            <>
              <div className={cx("option-date-picker")}>
                <DatePickerStateProvider
                  config={{
                    selectedDates: !isRangeSelect ? [] : tempDateForSpecificDate,
                    onDatesChange: onChangeSpecificDate,
                    dates: {
                      minDate: new Date(),
                      mode: !isRangeSelect ? "multiple" : "range",
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
                        formatter={(date: string) => {
                          return stringToDate(date, pageOptions.lang)
                        }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <OptionBar section={section} value="isRangeSelect" />
          <OptionBar section={section} value="addAnyDate" />
          {!specificDate && (
            <>
              <OptionBar section={section} value="isAlways" />
              {!isAlways && (
                <>
                  <div className={cx("option-date-picker")}>
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
                </>
              )}
            </>
          )}
        </div>
        {!specificDate && (
          <OptionRatio
            optionsArr={[{ value: "all" }, { value: "everyWeekdays" }, { value: "everyWeekend" }]}
            section={section}
            targetKey="interval"
          />
        )}
      </div>
    </div>
  )
}

export default memo(Calender)
