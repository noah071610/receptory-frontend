"use client"

import AddBtn from "@/components/AddBtn"
import FormTitle from "@/components/FormTitle"
import Input from "@/components/Input"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
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
        style={{ background: list.src ? getImageUrl({ isCenter: true, url: list.src }) : colors.graySoft }}
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
  const { setActive, setSelectedSection, selectedSection } = useEditorStore()
  const selectedList = section.value
  const selectList = section.list

  const getSelectedSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const toggleSelect = () => {
    getSelectedSection()
    setActive({ key: "modal", payload: { type: "select-list" } })
  }

  const onClickAddImage = (i: number) => {
    getSelectedSection()
    setActive({ key: "modal", payload: { type: "select-image", payload: i } })
  }

  return (
    <div className={cx(style.layout)}>
      <FormTitle section={section} />
      <button onClick={toggleSelect} className={cx(style["list-select-btn"])}>
        {selectedList ? selectedList.data.title : t("리스트 선택")}
      </button>
      <div className={cx(style.options)}>
        <OptionTitleInputs section={section} />
        <div>
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
    </div>
  )
}

export default memo(Select)
