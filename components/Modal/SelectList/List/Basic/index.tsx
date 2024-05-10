"use client"
import { DesignTypes, SectionListType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import Image from "next/image"
import style from "./style.module.scss"

import { UserSelectedListType } from "@/types/Main"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

export const BasicList = ({
  v,
  i,
  design,
  onChangeSelect,
  userSelectedList,
}: {
  v: SectionListType
  i: number
  design: DesignTypes
  userSelectedList: UserSelectedListType[]
  onChangeSelect: (selectedList: SectionListType, index: number) => void
}) => {
  const active = userSelectedList.findIndex(({ index }) => index === i) >= 0
  return (
    <li className={cx("list", { active })} onClick={() => onChangeSelect(v, i)}>
      {active && (
        <div data-type="selected">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
      {design === "imageWithText" &&
        (v.src ? (
          <picture className={cx("image")}>
            <Image width={100} height={80} src={v.src} alt="image" />
          </picture>
        ) : (
          <div className={cx("list-number")}>
            <div className={cx("number")}>
              <span>{i + 1}</span>
            </div>
          </div>
        ))}
      {design === "text" && (
        <div className={cx("number")}>
          <span>{i + 1}</span>
        </div>
      )}
      <div className={cx("list-content")}>
        {hasString(v.data.title) && <h3>{v.data.title}</h3>}
        {hasString(v.data.description) && <p>{v.data.description}</p>}
      </div>
    </li>
  )
}

export default BasicList
