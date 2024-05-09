"use client"

import AddBtn from "@/components/AddBtn"
import Input from "@/components/Input"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import { faPenFancy, faSquareCheck, faSquareXmark, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function List({
  section,
  list,
  index,
  isDisplayMode,
}: {
  section: SectionType
  list: SectionListType
  index: number
  isDisplayMode?: boolean
}) {
  const { setList } = useEditorStore()
  const [design, animation] = [list.design, section.style.animation]
  const getDesign = (str: string) => {
    switch (str) {
      case "check":
        return "uncheck"
      case "uncheck":
        return "underline"
      case "underline":
        return "caution"
      case "caution":
        return "check"
      default:
        return "check"
    }
  }

  const onClickChangeDesign = () => {
    setTimeout(() => {
      setList({
        index,
        key: "design",
        payload: getDesign(design),
      })
    }, 0)
  }

  return (
    <li
      style={getAnimation({
        type: animation,
        delay: isDisplayMode ? index * 180 : 0,
      })}
      className={cx("list-wrapper", design)}
    >
      <div onClick={onClickChangeDesign} className={cx("icon")}>
        {design === "check" && <FontAwesomeIcon icon={faSquareCheck} />}
        {design === "uncheck" && <FontAwesomeIcon icon={faSquareXmark} />}
        {design === "underline" && <FontAwesomeIcon icon={faPenFancy} />}
        {design === "caution" && <FontAwesomeIcon icon={faTriangleExclamation} />}
      </div>
      <div className={cx("content")}>
        <Input
          inputType="text"
          isOptional={false}
          listIndex={index}
          type="input"
          value={list.value}
          displayMode={isDisplayMode && "span"}
          maxLength={25}
          className={isDisplayMode ? style.text : ""}
        />
      </div>
    </li>
  )
}

function Callout({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { setActive } = useEditorStore()

  return (
    <div className={cx("layout")}>
      <ul className={cx("check-list")}>
        {section.list.map((v, i) => (
          <List isDisplayMode={isDisplayMode} index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
      {!isDisplayMode && <AddBtn section={section} type="checkList" />}
    </div>
  )
}

export default memo(Callout)
