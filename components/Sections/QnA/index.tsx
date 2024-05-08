"use client"

import AddBtn from "@/components/AddBtn"
import Input from "@/components/Input"
import { changeOpacity, colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo, useMemo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Search = memo(({}: {}) => {
  return <></>
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
        <Input
          section={section}
          inputType="title"
          listIndex={index}
          isOptional={false}
          maxLength={80}
          dataKey="title"
          displayMode={isDisplayMode && "h2"}
          value={list.data.title}
          className={cx(isDisplayMode ? style.title : "title-input")}
        />
        <div style={{ color: isActive ? color : colors.black }} className={cx("icon", "arrow")}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className={cx("content-layout")}>
        <Text isDisplayMode={isDisplayMode} listIndex={index} section={section} />
      </div>
    </li>
  )
}

export default function QnA({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  return (
    <div className={cx("qna")}>
      <Search />
      <ul className={cx("qna-list")}>
        {section.list.map((v, i) => (
          <List isDisplayMode={isDisplayMode} index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
      {!isDisplayMode && <AddBtn section={section} type="qna" />}
    </div>
  )
}
