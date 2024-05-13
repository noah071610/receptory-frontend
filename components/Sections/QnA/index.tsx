"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { colors } from "@/config/colors"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useMemo, useState } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = cs.bind(style)

const List = ({
  section,
  list,
  index,
  onDelete,
}: {
  section: SectionType
  list: SectionListType
  index: number
  onDelete: (i: number) => void
}) => {
  const { color } = section.style
  const [isActive, setIsActive] = useState(true)
  const titleBackgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])
  const onClickTitle = (e: any) => {
    setIsActive((b) => (e.target.closest(`input`) ? true : !b))
  }

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
          <Input
            type="input"
            inputType="title"
            listIndex={index}
            isOptional={false}
            maxLength={80}
            dataKey="title"
            value={list.data.title}
            section={section}
            className={cx("title-input")}
          />
        </div>

        <div style={{ color: isActive ? color : colors.black }} className={cx("icon", "arrow")}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className={cx("content-layout")}>
        <Text listIndex={index} section={section} />
        <DeleteBtn deleteEvent={onDelete} srcKey="list" listIndex={index} />
      </div>
    </li>
  )
}

export default function QnA({ section }: { section: SectionType }) {
  const { deleteList } = useEditorStore()
  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }

  return (
    <div className={cx("qna")}>
      <ul className={cx("qna-list")}>
        {section.list.map((v, i) => (
          <List onDelete={onDelete} index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
      <AddBtn section={section} type="qna" />
    </div>
  )
}
