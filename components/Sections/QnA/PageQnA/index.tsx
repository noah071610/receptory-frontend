"use client"

import { colors } from "@/config/colors"
import { SectionListType, SectionType } from "@/types/Edit"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useMemo, useState } from "react"
import PageText from "../../Text/PageText"
import style from "./style.module.scss"
const cx = cs.bind(style)

const List = ({ section, list }: { section: SectionType; list: SectionListType; index: number }) => {
  const { color } = section.style
  const titleBackgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])
  const [isActive, setIsActive] = useState(true)
  const onClickTitle = () => setIsActive((p) => !p)

  return (
    <li className={cx("list", { isOpen: isActive })}>
      <div
        style={{
          backgroundColor: isActive ? titleBackgroundColor : undefined,
          borderColor: isActive ? color : colors.border,
        }}
        onClick={onClickTitle}
        className={cx("title-wrapper")}
      >
        <div style={{ color: isActive ? color : colors.black }} className={cx("icon", "q")}>
          <FontAwesomeIcon icon={faQ} />
          <span>{"."}</span>
        </div>
        <div className={cx("title-inner")}>
          <h2 className={cx("title")}>{list.data.title}</h2>
        </div>

        <div style={{ color: isActive ? color : colors.black }} className={cx("icon", "arrow")}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className={cx("content-wrapper")}>
        <div className={cx("content-layout", { isActive })}>
          <PageText text={list.value} />
        </div>
      </div>
    </li>
  )
}

export default function PageQnA({ section }: { section: SectionType }) {
  return (
    <div className={cx("qna")}>
      <ul className={cx("qna-list")}>
        {section.list.map((v, i) => (
          <List index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
    </div>
  )
}
