"use client"

import { DateAnalyserType } from "@/types/Insight"
import { Langs } from "@/types/Main"
import { setDateFormat } from "@/utils/helpers/setDate"
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js"
import cs from "classNames/bind"
import { useCallback, useMemo, useState } from "react"
import { Bar } from "react-chartjs-2"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const SubmitChart = ({ data, lang, initialTarget }: { data: DateAnalyserType; lang: Langs; initialTarget: string }) => {
  const yearMonthArr = Object.keys(data)
  const [curTarget, setCurTarget] = useState<null | string>(initialTarget)
  const [targetArr, setTargetArr] = useState<number[]>(data[initialTarget])
  const onClickMenu = useCallback((date: string) => {
    setCurTarget(date)
    setTargetArr(data[date])
  }, [])

  const chartData = useMemo(
    () => ({
      labels: targetArr.map((_, i) => `${i + 1}일`),
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

  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>접수 현황</span>
      </h2>
      <Swiper className={cx("slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
        {yearMonthArr.map((yearMonth) => {
          return (
            <SwiperSlide className={cx("slide")} key={`menu_${yearMonth}`}>
              <button
                className={cx({ active: curTarget === yearMonth })}
                onClick={() => onClickMenu(yearMonth)}
                key={`${yearMonth}`}
              >
                <span>{setDateFormat({ date: new Date(yearMonth), lang, noDate: true })}</span>
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className={cx("chart-inner")}>
        <div className={cx("chart")}>
          <Bar
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
    </div>
  )
}

export default SubmitChart
