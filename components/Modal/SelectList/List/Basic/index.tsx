"use client"
import { DesignTypes, SectionListType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import Image from "next/image"
import style from "./style.module.scss"

import { SelectedValueType } from "@/types/Main"
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
  userSelectedList: SelectedValueType[]
  onChangeSelect: (selectedList: SectionListType) => void
}) => {
  const active = userSelectedList.findIndex(({ key }) => key === v.id) >= 0
  return (
    <li className={cx("list", design, { active })} onClick={() => onChangeSelect(v)}>
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
