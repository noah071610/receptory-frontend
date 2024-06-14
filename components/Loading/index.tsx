import style from "./style.module.scss"

import cs from "classnames/bind"
const cx = cs.bind(style)

export default function Loading({ isFull }: { isFull?: boolean }) {
  return (
    <div className={cx("spinner", { isFull })}>
      <div className={cx("before")}></div>
      <div className={cx("after")}></div>
    </div>
  )
}
