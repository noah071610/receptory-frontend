"use client"

import AddBtn from "@/components/AddBtn"
import Input from "@/components/Input"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox } from "@headlessui/react"
import classNames from "classNames"
import { memo, useState } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Select({ section }: { section: SectionType }) {
  const [selectedList, setSelectedList] = useState("리스트 선택하기")
  const [query, setQuery] = useState("")
  const { setActive, setSelectedSection, selectedSection } = useEditorStore()
  const selectList = section.list

  const onClickAddImage = (i: number) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setActive({ key: "modal", payload: { type: "select", payload: i } })
  }

  return (
    <div className={cx(style.layout)}>
      <Listbox value={selectedList} onChange={setSelectedList}>
        <label className={cx(style["list-title"])}>
          <h2>리스트 선택</h2>
          <p>리스트를 선택하세요.</p>
        </label>
        <Listbox.Button className={cx(style["list-btn"])}>{selectedList}</Listbox.Button>
        <Listbox.Options className={cx(style["list-options"])}>
          {selectList.map((v) => (
            <Listbox.Option key={v.id} value={v.data.title}>
              {v.src && (
                <div
                  style={{ background: getImageUrl({ isCenter: true, url: v.src }) }}
                  className={cx(style.image)}
                ></div>
              )}
              <div className={cx(style.content)}>
                <h3>{v.data.title}</h3>
                <p>{v.data.description}</p>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <div className={cx(style.options)}>
        <h4>리스트 수정</h4>
        <ul className={cx(style["list-edit"])}>
          {selectList.map((v, i) => (
            <li key={`edit-${v.id}`}>
              <div
                onClick={() => onClickAddImage(i)}
                style={{ background: v.src ? getImageUrl({ isCenter: true, url: v.src }) : colors.graySoft }}
                className={cx(style.image)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div className={cx(style.content)}>
                <Input
                  className={cx(style.title)}
                  inputType="title"
                  isOptional={true}
                  value={v.data.title}
                  listIndex={i}
                  dataKey="title"
                />
                <Input
                  className={cx(style.description)}
                  inputType="description"
                  isOptional={true}
                  value={v.data.description}
                  listIndex={i}
                  dataKey="description"
                />
              </div>
            </li>
          ))}
        </ul>
        <AddBtn section={section} type="select" />
      </div>
    </div>
  )
}

export default memo(Select)
