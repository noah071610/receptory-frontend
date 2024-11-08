"use client"

import NumberRange from "@/components/NumberRange"
import { useInsightStore } from "@/store/insight"
import { TimeAnalyserType } from "@/types/Insight"
import cs from "classnames/bind"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const TimeChart = ({ anytimeCount, data }: { anytimeCount: number; data: TimeAnalyserType }) => {
  const { t } = useTranslation(["insight-page"])

  const isEmpty = [...data.AM, ...data.PM].reduce((acc, cur) => acc + cur, 0) === 0
  const { setCurFilterAll, setIsFilterUpdate } = useInsightStore(["setCurFilterAll", "setIsFilterUpdate"])
  const onClickTime = (start: string, end: string) => {
    setCurFilterAll({
      type: "time",
      startQuery: start,
      endQuery: end,
      isAnyDateOrAnytime: false,
    })
    setIsFilterUpdate(true)
  }

  const onClickAnytime = () => {
    setCurFilterAll({
      type: "time",
      startQuery: "00:00",
      endQuery: "00:00",
      isAnyDateOrAnytime: true,
    })
    setIsFilterUpdate(true)
  }
  return (
    <div className={cx("chart-wrapper")}>
      <h2>
        <span>{t("timeTitle")}</span>
      </h2>
      {!isEmpty || anytimeCount > 0 ? (
        <>
          <div className={cx("chart-time-inner")}>
            <div className={cx("chart-time")}>
              <div className={cx("time-container")}>
                <div className={cx("time-main")}>
                  {data.AM.map((v, i) => {
                    const start = `${i.toString().padStart(2, "0")}:00`
                    const end = `${(i + 1).toString().padStart(2, "0")}:00`
                    return (
                      <button
                        disabled={v === 0}
                        onClick={() => onClickTime(start, end)}
                        className={cx("count-btn")}
                        key={`am-${i}`}
                      >
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
                      <button
                        disabled={v === 0}
                        onClick={() => onClickTime(start, end)}
                        className={cx("count-btn")}
                        key={`am-${i}`}
                      >
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

          {anytimeCount > 0 && (
            <div className={cx("anytime-wrapper")}>
              <button onClick={onClickAnytime}>
                <div className={cx("circle")}></div>
                <div className={cx("anytime-text")}>
                  <span>
                    {t("anytime")}
                    {" : "}
                  </span>
                  <span>{anytimeCount}</span>
                </div>
              </button>
            </div>
          )}
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

export default TimeChart
