"use client"

import { useMainStore } from "@/store/main"
import { DateAnalyserType } from "@/types/Insight"
import { setDateFormat } from "@/utils/helpers/setDate"
import { DatePickerStateProvider } from "@rehookify/datepicker"
import cs from "classnames/bind"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { CalenderMain } from "./DatePicker"
import style from "./style.module.scss"
const cx = cs.bind(style)

const CalendarChart = ({ data, initialTarget }: { data: DateAnalyserType; initialTarget?: string }) => {
  const { t } = useTranslation(["insight-page"])
  const { pageLang } = useMainStore(["pageLang"])

  const yearMonthArr = Object.keys(data)
  const [curTarget, setCurTarget] = useState<null | string>(initialTarget ?? null)
  const [targetArr, setTargetArr] = useState<number[]>(initialTarget ? data[initialTarget] : [])
  const onClickMenu = useCallback(
    (date: string) => {
      setCurTarget(date)
      setTargetArr(data[date])
    },
    [data]
  )

  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>{t("calendarTitle")}</span>
      </h2>
      {initialTarget ? (
        <>
          <Swiper className={cx("slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
            {yearMonthArr.map((yearMonth) => {
              return (
                <SwiperSlide className={cx("slide")} key={`menu_${yearMonth}`}>
                  <button
                    className={cx({ active: curTarget === yearMonth })}
                    onClick={() => onClickMenu(yearMonth)}
                    key={`${yearMonth}`}
                  >
                    <span>{setDateFormat({ date: new Date(yearMonth), lang: pageLang, noDate: true })}</span>
                  </button>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <div className={cx("calendar-inner")}>
            <div className={cx("calendar")}>
              <DatePickerStateProvider
                config={{
                  offsetDate: curTarget ? new Date(curTarget) : undefined,
                  selectedDates: [],
                  onDatesChange: () => {},
                }}
              >
                <CalenderMain calendarChartArr={targetArr} />
              </DatePickerStateProvider>
            </div>
          </div>
        </>
      ) : (
        <div className={cx("no-list")}>
          <img src="/images/icons/crying.png" alt="crying" />
          <span>{t("emptySubmitted")}</span>
        </div>
      )}
    </div>
  )
}

export default CalendarChart
