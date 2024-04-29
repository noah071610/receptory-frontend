"use client"

import AddBtn from "@/components/AddBtn"
import Input from "@/components/Input"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Search = memo(({}: {}) => {
  return <></>
})

const List = ({ section, list, index }: { section: SectionType; list: SectionListType; index: number }) => {
  const { setList, selectedSection, setSelectedSection } = useEditorStore()
  const onClickTitle = (e: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }

    setList({ key: "isActive", index: index, payload: e.target.closest(`input`) ? true : !list.isActive })
  }

  return (
    <li className={cx(style.list, { [style.isOpen]: list.isActive })}>
      <div onClick={onClickTitle} className={cx(style.title)}>
        <div className={cx(style.icon, style.q)}>
          <FontAwesomeIcon icon={faQ} />
          <span>{"."}</span>
        </div>
        <Input
          inputType="title"
          listIndex={index}
          isOptional={false}
          dataKey="title"
          value={list.data.title}
          className={cx(style["title-input"])}
        />
        <div className={cx(style.icon, style.arrow)}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div className={cx(style["content-layout"])}>
        <Text listIndex={index} section={section} textColor={colors.blackSoft} />
      </div>
    </li>
  )
}

export default function QnA({ section }: { section: SectionType }) {
  return (
    <div className={cx(style.qna)}>
      <Search />
      <ul className={cx(style["qna-list"])}>
        {section.list.map((v, i) => (
          <List index={i} key={v.id} list={v} section={section} />
        ))}
      </ul>
      <AddBtn section={section} type="qna" />
    </div>
  )
}
