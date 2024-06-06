"use client"

import NumberRange from "@/components/NumberRange"
import { TimeAnalyserType } from "@/types/Insight"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

const TimeChart = ({ data }: { data: TimeAnalyserType }) => {
  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>시간대별</span>
      </h2>
      <div className={cx("chart-time-inner")}>
        <div className={cx("chart-time")}>
          <div className={cx("time-container")}>
            <div className={cx("time-main")}>
              {data.AM.map((v, i) => {
                const start = `${i.toString().padStart(2, "0")}:00`
                const end = `${(i + 1).toString().padStart(2, "0")}:00`
                return (
                  <button className={cx("count-btn")} key={`am-${i}`}>
                    <div className={cx("content", "time")}>
                      <NumberRange start={start} end={end} />
                    </div>

                    <div className={cx("count", { active: v > 0 })}>
                      <div className={cx("circle")}></div>
                      <span>{v}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className={cx("time-container")}>
            <div className={cx("time-main")}>
              {data.PM.map((v, i) => {
                const start = `${(i + 12).toString().padStart(2, "0")}:00`
                const end = `${(i + 12 + 1).toString().padStart(2, "0")}:00`
                return (
                  <button className={cx("count-btn")} key={`am-${i}`}>
                    <div className={cx("content", "time")}>
                      <NumberRange start={start} end={end} />
                    </div>

                    <div className={cx("count", { active: v > 0 })}>
                      <div className={cx("circle")}></div>
                      <span>{v}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeChart
