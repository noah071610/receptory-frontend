"use client"

import AddBtn from "@/components/AddBtn"
import Input from "@/components/Input"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const PageText = dynamic(() => import("../Text/PageText"), {
  ssr: true,
})
const Text = dynamic(() => import("../Text"), {
  ssr: true,
})

const List = ({
  section,
  list,
  index,
  isDisplayMode,
}: {
  section: SectionType
  list: SectionListType
  index: number
  isDisplayMode?: boolean
}) => {
  const { color } = section.style
  const { setList, setSelectedSection, selectedSection } = useEditorStore()
  const isActive = list.isActive
  const titleBackgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])
  const onClickTitle = (e: any) => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    setList({ key: "isActive", index, payload: e.target.closest(`input`) ? true : !list.isActive })
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
        {isDisplayMode ? (
          <h2 className={cx("title")}>{list.data.title}</h2>
        ) : (
          <Input
            type="input"
            inputType="title"
            listIndex={index}
            isOptional={false}
            maxLength={80}
            dataKey="title"
            value={list.data.title}
            className={cx("title-input")}
          />
        )}

        <div style={{ color: isActive ? color : colors.black }} className={cx("icon", "arrow")}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className={cx("content-layout")}>
        {isDisplayMode ? <PageText text={list.text} /> : <Text listIndex={index} section={section} />}
      </div>
    </li>
  )
}

export default function QnA({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  return (
    <div className={cx("qna")}>
      <ul className={cx("qna-list")}>
        {section.list.map((v, i) => (
          <List isDisplayMode={isDisplayMode} index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
      {!isDisplayMode && <AddBtn section={section} type="qna" />}
    </div>
  )
}
