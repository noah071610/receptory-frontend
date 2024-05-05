"use client"

import classNames from "classNames"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionListType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import Image from "next/image"
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
                <picture className={cx(style.image)}>
                  <Image width={100} height={80} src={v.src} alt="image" />
                </picture>
              )}
              <div className={cx(style["list-content"])}>
                {hasString(v.data.title) && <h3>{v.data.title}</h3>}
                {hasString(v.data.description) && <p>{v.data.description}</p>}
              </div>
            </li>
          ))}
          {/* <li className={cx(style["select-none"])}>
            <span>{t("선택 없음")}</span>
          </li> */}
        </ul>
        <div className={cx(style["btn-wrapper"])}>
          <button onClick={() => onChangeSelect(null)}>
            <span>{t("선택 없음")}</span>
          </button>
        </div>
      </ModalLayout>
    )
  )
}

export default SelectList
