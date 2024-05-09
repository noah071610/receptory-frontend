import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

export default function Loading() {
  return <div className={cx("spinner")}></div>
}
