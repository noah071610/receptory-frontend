"use client"

import { useInsightStore } from "@/store/insight"
import { useMainStore } from "@/store/main"
import { DateAnalyserType } from "@/types/Insight"
import { setDateFormat } from "@/utils/helpers/setDate"
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js"
import cs from "classnames/bind"
import { useCallback, useMemo, useRef, useState } from "react"
import { Bar, getElementAtEvent } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const SubmitChart = ({ data, initialTarget }: { data: DateAnalyserType; initialTarget?: string }) => {
  const { t } = useTranslation(["insight-page"])
  const yearMonthArr = Object.keys(data)
  const { pageLang } = useMainStore(["pageLang"])
  const { setCurFilterAll, setIsFilterUpdate } = useInsightStore(["setCurFilterAll", "setIsFilterUpdate"])

  const [curTarget, setCurTarget] = useState<null | string>(initialTarget ?? null)
  const [targetArr, setTargetArr] = useState<number[]>(initialTarget ? data[initialTarget] : [])

  const onClickMenu = useCallback(
    (date: string) => {
      setCurTarget(date)
      setTargetArr(data[date])
    },
    [data]
  )

  const chartData = useMemo(
    () => ({
      labels: targetArr.slice(1).map((_, i) => `${i}일`),
      datasets: [
        {
          label: "접수 수",
          data: targetArr.map((v) => v),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    }),
    [targetArr]
  )

  const chartRef = useRef()
  const onClickChart = (event: any) => {
    if (chartRef?.current && curTarget) {
      const target = getElementAtEvent(chartRef.current, event)
      if (target[0]) {
        const [year, month] = curTarget.split("-")
        const filterDate = `${year}-${month.padStart(2, "0")}-${target[0].index.toString().padStart(2, "0")}`
        setCurFilterAll({
          startQuery: filterDate,
          endQuery: filterDate,
          type: "createdAt",
        })
        setIsFilterUpdate(true)
      }
    }
  }

  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>{t("submitTitle")}</span>
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
          <div className={cx("chart-inner")}>
            <div className={cx("chart")}>
              <Bar
                ref={chartRef}
                onClick={onClickChart}
                options={{
                  indexAxis: "x" as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: {
                    bar: {
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
                data={chartData}
              />
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

export default SubmitChart
