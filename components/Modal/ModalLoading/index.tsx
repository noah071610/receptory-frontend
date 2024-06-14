import Loading from "@/components/Loading"
import style from "./style.module.scss"

import cs from "classnames/bind"
const cx = cs.bind(style)

export default function ModalLoading() {
  return (
    <div className={cx("overlay")}>
      <Loading />
    </div>
  )
}
