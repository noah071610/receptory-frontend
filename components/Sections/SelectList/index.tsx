"use client"

import AddBtn from "@/components/AddBtn"
import FormUserInput from "@/components/FormUserInput"
import Input from "@/components/Input"
import OptionBar from "@/components/Options/OptionBar"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

import DeleteBtn from "@/components/DeleteBtn"
import { toastError } from "@/config/toast"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

const ListEdit = ({
  list,
  listIndex,
  onClickAddImage,
  section,
  onDelete,
}: {
  list: SectionListType
  listIndex: number
  onClickAddImage: (i: number) => void
  section: SectionType
  onDelete: (i: number) => void
}) => {
  return (
    <li key={`edit-${list.id}`}>
      <div className={cx("inner")}>
        <div
          onClick={() => onClickAddImage(listIndex)}
          style={{ background: list.src ? getImageUrl({ url: list.src }) : "none" }}
          className={cx("image")}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className={cx("content")}>
          <Input
            type="input"
            isBottomError={true}
            className={cx("title")}
            inputType="title"
            isOptional={false}
            value={list.data.title}
            listIndex={listIndex}
            dataKey="title"
            section={section}
          />
          <Input
            type="input"
            className={cx("description")}
            inputType="description"
            isOptional={true}
            value={list.data.description}
            listIndex={listIndex}
            section={section}
            dataKey="description"
          />
        </div>
      </div>
      <DeleteBtn deleteEvent={onDelete} listIndex={listIndex} srcKey="list" isDeleteList={true} />
    </li>
  )
}

function Select({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setActive, deleteList } = useEditorStore()
  const { setModal, selected, setSelected } = useMainStore()
  const { value } = selected[section.index - 1] ?? {}
  const selectList = section.list

  const toggleSelect = () => {
    setModal({ section, type: "select" })
  }

  const onClickAddImage = (i: number) => {
    setTimeout(() => {
      setActive({ key: "modal", payload: { type: "select-image", payload: i } })
    }, 0)
  }

  const reset = () => {
    setSelected({ section, value: [] })
  }

  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faList}
        onClick={toggleSelect}
        title={section.data.title}
        description={section.data.description}
        isMultiple={true}
        isActive={value && value.length > 0}
        resetEvent={reset}
      >
        {value?.length > 0 ? (
          value.map(({ text }, i) => (
            <span key={`select-${i}`}>
              {i > 0 ? " , " : ""}
              {text}
            </span>
          ))
        ) : (
          <span>{t("none")}</span>
        )}
      </FormUserInput>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <OptionBar value="addSelectNone" section={section} />
        <OptionBar value="isMultiple" section={section} />
        <div className={cx("list-edit-wrapper")}>
          <h4>
            <span>리스트 수정</span>
          </h4>
          <ul className={cx("list-edit")}>
            {selectList.map((list, i) => (
              <ListEdit
                section={section}
                onClickAddImage={onClickAddImage}
                key={`${list.id}-edit`}
                onDelete={onDelete}
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
