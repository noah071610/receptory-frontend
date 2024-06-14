import Loading from "..";
import style from "./style.module.scss";

import cs from "classnames/bind";
const cx = cs.bind(style)

export default function PageLoading({ isLoading, isAbsolute }: { isLoading: boolean; isAbsolute?: boolean }) {
  return (
    <div className={cx("overlay", { isAbsolute, isLoading })}>
      <Loading isFull={!isAbsolute} />
    </div>
  )
}
