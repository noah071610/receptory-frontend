"use client"

import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { faChevronDown, faQ } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { stateToHTML } from "draft-js-export-html"
import { memo } from "react"
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

    setList({ key: "isActive", index: list.index, payload: e.target.closest(`textarea`) ? true : !list.isActive })
  }

  return (
    <li className={cx(style.list, { [style.isOpen]: list.isActive })}>
      <div onClick={onClickTitle} className={cx(style.title)}>
        <div className={cx(style.icon, style.q)}>
          <FontAwesomeIcon icon={faQ} />
          <span>{"."}</span>
        </div>
        <h1>{list.data.title}</h1>
        <div className={cx(style.icon, style.arrow)}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: stateToHTML(section.list[index].text.getCurrentContent()) }}
        className={cx(style["content-layout"])}
      ></div>
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
    </div>
  )
}
