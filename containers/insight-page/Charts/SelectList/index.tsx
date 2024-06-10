"use client"

import { backgroundColors, borderColors } from "@/config/colors"
import { SelectChartLabel, SelectChartType } from "@/types/Insight"
import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js"
import cs from "classNames/bind"
import { produce } from "immer"
import { useCallback, useMemo, useState } from "react"
import { Pie } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

ChartJS.register(ArcElement, Tooltip)

const Chart = ({ labels, title }: { labels: SelectChartLabel[]; title: string }) => {
  const [activeArr, setActiveArr] = useState(Array.from({ length: labels.length }, () => true))

  const chartData = useMemo(() => {
    const target = labels.filter((_, i) => activeArr[i])
    return {
      labels: target.map(({ title }) => title),
      datasets: [
        {
          label: "# number",
          data: target.map(({ count }) => count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    }
  }, [labels, activeArr])

  const onClickMenu = useCallback(
    (i: number) => {
      if (activeArr[i] && activeArr.filter((b) => b).length <= 1) return

      setActiveArr(
        produce((draft) => {
          draft[i] = !draft[i]
        })
      )
    },
    [activeArr]
  )

  return (
    <div>
      <h3>
        <span>{title}</span>
      </h3>
      <Swiper className={cx("slider")} spaceBetween={5} slidesPerView={"auto"} modules={[FreeMode]}>
        {labels.map(({ title, count }, i) => {
          return (
            <SwiperSlide className={cx("slide")} key={`menu-${i}`}>
              <button className={cx("count-btn", { active: activeArr[i] })} onClick={() => onClickMenu(i)}>
                <div
                  className={cx("content", {
                    active: activeArr[i],
                  })}
                >
                  {title.slice(0, 10)}
                </div>

                <div className={cx("count", { active: count > 0 })}>
                  <div
                    style={{
                      borderColor: borderColors[i],
                      backgroundColor: backgroundColors[i],
                    }}
                    className={cx("color")}
                  ></div>
                  <span>{count}</span>
                </div>
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

const SelectListChart = ({
  sectionName,
  selectChartArr,
}: {
  sectionName: string
  selectChartArr: SelectChartType[]
}) => {
  const { t } = useTranslation(["insight-page"])

  const isEmpty = selectChartArr.flat().reduce((acc, cur) => cur.labels.length + acc, 0) === 0
  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>{t(sectionName)}</span>
      </h2>
      {!isEmpty ? (
        <>
          {selectChartArr.map(({ labels, title }, i) => (
            <Chart labels={labels} title={title} key={`select-chart-${i}`} />
          ))}
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

export default SelectListChart
