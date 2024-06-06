"use client"

import { SelectAnalyserType } from "@/types/Insight"
import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js"
import cs from "classNames/bind"
import { useCallback, useMemo, useState } from "react"
import { Pie } from "react-chartjs-2"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(ArcElement, Tooltip)

const Chart = ({
  obj,
}: {
  obj: {
    [itemKey: string]: number
  }
}) => {
  const [curTarget, setCurTarget] = useState<null | string>(null)
  const onClickMenu = useCallback((itemKey: string) => {
    setCurTarget(itemKey)
  }, [])
  const [labels, setLabels] = useState(
    Object.keys(obj).map((v) => ({
      key: v,
      isActive: true,
    }))
  )

  const counts = Object.values(obj)

  const chartData = useMemo(
    () => ({
      labels: labels.map(({ key }) => key),
      datasets: [
        {
          label: "# of Votes",
          data: counts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [labels, counts]
  )

  const onClickMenu = (i: number) => {
    setLabels((arr) => {
      arr[i].isActive = !arr[i].isActive
      return arr
    })
  }

  return (
    <div>
      <Swiper className={cx("slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
        {labels.map(({ key, isActive }, i) => {
          return (
            <SwiperSlide className={cx("slide")} key={`menu-${key}`}>
              <button className={cx({ active: isActive })} onClick={() => onClickMenu(i)} key={`${key}`}>
                <span>{key}</span>
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className={cx("select-inner")}>
        <div className={cx("select")}>
          <Pie
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={chartData}
          />
        </div>
      </div>
    </div>
  )
}

const SelectListChart = ({ data }: { data: SelectAnalyserType }) => {
  const sectionSelectArr = Object.values(data)

  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>리스트</span>
      </h2>
      {sectionSelectArr.map((obj, i) => (
        <Chart obj={obj} key={`select-chart-${i}`} />
      ))}
    </div>
  )
}

export default SelectListChart
