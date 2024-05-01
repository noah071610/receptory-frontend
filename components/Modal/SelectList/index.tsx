"use client"

import classNames from "classNames"

import { getImageUrl } from "@/config"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionListType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import ModalLayout from ".."
import style from "./style.module.scss"

const cx = classNames.bind(style)

export const SelectList = () => {
  const { t } = useTranslation()
  const { setActive, setValue, selectedSection } = useEditorStore()
  const selectList = selectedSection?.list.filter((v) => hasString(v.data.title))

  const onChangeSelect = (selectedList: SectionListType | null) => {
    setValue({ payload: selectedList })
    setActive({ key: "modal", payload: { type: null } })
  }

  return (
    selectList &&
    selectList.length > 0 && (
      <ModalLayout modalStyle={style.content}>
        <ul className={cx(style["list-options"])}>
          {selectList.map((v) => (
            <li onClick={() => onChangeSelect(v)} key={v.id}>
              {v.src && (
                <div
                  style={{ background: getImageUrl({ isCenter: true, url: v.src }) }}
                  className={cx(style.image)}
                ></div>
              )}
              <div className={cx(style.content)}>
                {hasString(v.data.title) && <h3>{v.data.title}</h3>}
                {hasString(v.data.description) && <p>{v.data.description}</p>}
              </div>
            </li>
          ))}
          <li onClick={() => onChangeSelect(null)} className={cx(style["select-none"])}>
            <span>{t("선택 없음")}</span>
          </li>
        </ul>
      </ModalLayout>
    )
  )
}

export default SelectList
