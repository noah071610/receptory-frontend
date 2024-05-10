"use client"
import { SectionListType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import style from "./style.module.scss"

import { UserSelectedListType } from "@/types/Main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

export const ThumbList = ({
  v,
  i,
  onChangeSelect,
  userSelectedList,
}: {
  v: SectionListType
  i: number
  onChangeSelect: (selectedList: SectionListType, index: number) => void
  userSelectedList: UserSelectedListType[]
}) => {
  const active = userSelectedList.findIndex(({ index }) => index === i) >= 0
  return (
    <li onClick={() => onChangeSelect(v, i)}>
      {active && (
        <div data-type="selected">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
      <div
        style={{
          background: getImageUrl({ url: hasString(v.src) ? v.src : "/images/noImage.png" }),
        }}
        className={cx("list-content", { active })}
      >
        <div className={cx("text")}>
          {
            <>
              {hasString(v.data.title) && <h3>{v.data.title}</h3>}
              {hasString(v.data.description) && <p>{v.data.description}</p>}
            </>
          }
        </div>
      </div>
    </li>
  )
}

export default ThumbList
