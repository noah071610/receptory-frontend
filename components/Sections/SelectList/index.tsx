"use client"

import AddBtn from "@/components/AddBtn"
import FormUserInput from "@/components/FormUserInput"
import Input from "@/components/Input"
import OptionBar from "@/components/Options/OptionBar"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { getImageUrl } from "@/config"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const ListEdit = ({
  list,
  listIndex,
  onClickAddImage,
  section,
}: {
  list: SectionListType
  listIndex: number
  onClickAddImage: (i: number) => void
  section: SectionType
}) => {
  return (
    <li key={`edit-${list.id}`}>
      <div
        onClick={() => onClickAddImage(listIndex)}
        style={{ background: list.src ? getImageUrl({ isCenter: true, url: list.src }) : "none" }}
        className={cx(style.image)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </div>
      <div className={cx(style.content)}>
        <Input
          section={section}
          className={cx(style.title)}
          inputType="title"
          isOptional={false}
          value={list.data.title}
          listIndex={listIndex}
          dataKey="title"
        />
        <Input
          section={section}
          className={cx(style.description)}
          inputType="description"
          isOptional={true}
          value={list.data.description}
          listIndex={listIndex}
          dataKey="description"
        />
      </div>
    </li>
  )
}

function Select({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setActive } = useEditorStore()
  const selectedList = section.value
  const selectList = section.list

  const toggleSelect = () => {
    setTimeout(() => {
      setActive({ key: "modal", payload: { type: "select-list" } })
    }, 0)
  }

  const onClickAddImage = (i: number) => {
    setTimeout(() => {
      setActive({ key: "modal", payload: { type: "select-image", payload: i } })
    }, 0)
  }

  return (
    <div className={cx(style.layout)}>
      <FormUserInput
        icon={faList}
        onClick={toggleSelect}
        title={section.data.title}
        description={section.data.description}
      >
        <span> {selectedList ? selectedList.data.title : t("리스트 선택")}</span>
      </FormUserInput>
      {!isDisplayMode && (
        <div className={cx(style.options)}>
          <OptionTitleInputs section={section} />
          <OptionBar value="addSelectNone" section={section} />
          <div className={cx(style["list-edit-wrapper"])}>
            <h4>리스트 수정</h4>
            <ul className={cx(style["list-edit"])}>
              {selectList.map((list, i) => (
                <ListEdit
                  section={section}
                  onClickAddImage={onClickAddImage}
                  key={`${list.id}-edit`}
                  list={list}
                  listIndex={i}
                />
              ))}
            </ul>
            <AddBtn section={section} type="select" />
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Select)
