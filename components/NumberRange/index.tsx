"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

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
    <div className={cx(style.range)}>
      <span>{formatter ? formatter(start) : start}</span>
      {end && (
        <>
          <span className={cx(style.divide)}>{"~"}</span>
          <span>{formatter ? formatter(end) : end}</span>
        </>
      )}
    </div>
  )
}
export default NumberRange
