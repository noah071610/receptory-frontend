"use client"

import NumberRange from "@/components/NumberRange"
import { useInsightStore } from "@/store/insight"
import { TimeAnalyserType } from "@/types/Insight"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

const TimeChart = ({ data }: { data: TimeAnalyserType }) => {
  const isEmpty = [...data.AM, ...data.PM].reduce((acc, cur) => acc + cur, 0) === 0
  const { setCurFilterAll, setIsFilterUpdate } = useInsightStore()
  const onClickTime = (start: string, end: string) => {
    setCurFilterAll({
      type: "time",
      startQuery: start,
      endQuery: end,
    })
    setIsFilterUpdate(true)
  }
  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>시간대별</span>
      </h2>
      {!isEmpty ? (
        <>
          <div className={cx("chart-time-inner")}>
            <div className={cx("chart-time")}>
              <div className={cx("time-container")}>
                <div className={cx("time-main")}>
                  {data.AM.map((v, i) => {
                    const start = `${i.toString().padStart(2, "0")}:00`
                    const end = `${(i + 1).toString().padStart(2, "0")}:00`
                    return (
                      <button onClick={() => onClickTime(start, end)} className={cx("count-btn")} key={`am-${i}`}>
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
                      <button onClick={() => onClickTime(start, end)} className={cx("count-btn")} key={`am-${i}`}>
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
        </>
      ) : (
        <div className={cx("no-list")}>
          <img src="/images/icons/crying.png" alt="crying" />
          <span>아직 아무런 제출도 없어요</span>
        </div>
      )}
    </div>
  )
}

export default TimeChart
