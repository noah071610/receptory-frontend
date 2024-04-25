import classNames from "classNames"
import style from "./style.module.scss"

const cx = classNames.bind(style)

export default function Loading() {
  return <div className={cx(style.spinner)}></div>
}
