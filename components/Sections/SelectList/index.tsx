"use client"

import AddBtn from "@/components/AddBtn"
import FormUserInput from "@/components/FormUserInput"
import Input from "@/components/Input"
import OptionBar from "@/components/Options/OptionBar"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { memo } from "react"
import style from "./style.module.scss"

import DeleteBtn from "@/components/DeleteBtn"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

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
        style={{ background: list.src ? getImageUrl({ url: list.src }) : "none" }}
        className={cx("image")}
      >
        <FontAwesomeIcon icon={faPlus} />
      </div>
      <div className={cx("content")}>
        <Input
          type="input"
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
        <DeleteBtn listIndex={listIndex} srcKey="list" isDeleteList={true} />
      </div>
    </li>
  )
}

function Select({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setActive } = useEditorStore()
  const { setModal, selects } = useMainStore()
  const selectList = section.list

  const toggleSelect = () => {
    setModal({ section, type: "select" })
  }

  const onClickAddImage = (i: number) => {
    setTimeout(() => {
      setActive({ key: "modal", payload: { type: "select-image", payload: i } })
    }, 0)
  }

  return (
    <div className={cx("layout")}>
      <FormUserInput
        icon={faList}
        onClick={toggleSelect}
        title={section.data.title}
        description={section.data.description}
        isMultiple={true}
      >
        {selects?.length > 0 ? (
          selects.map((v, i) => (
            <div className={cx("selected-list-text")} key={`select-${i}`}>
              <span>{v.title}</span>
            </div>
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
          <h4>리스트 수정</h4>
          <ul className={cx("list-edit")}>
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
