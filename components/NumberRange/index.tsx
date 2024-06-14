"use client"

import cs from "classnames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

function NumberRange({
  start,
  end,
  formatter,
}: {
  start?: string | number
  end?: string | number
  formatter?: (value: any) => string | number
}) {
  return (
    <div className={cx("range")}>
      <span>{formatter ? formatter(start) : start}</span>
      {end && (
        <>
          <span className={cx("divide")}>{"~"}</span>
          <span>{formatter ? formatter(end) : end}</span>
        </>
      )}
    </div>
  )
}
export default NumberRange
