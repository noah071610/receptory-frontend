"use client"

import classNames from "classNames"

import { getImageUrl } from "@/config"
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
  const design = selectedSection?.design ?? "basic"
  const addSelectNone = selectedSection?.options?.addSelectNone ?? false

  const onChangeSelect = (selectedList: SectionListType | null) => {
    setValue({ payload: selectedList })
    setActive({ key: "modal", payload: { type: null } })
  }

  return (
    selectList &&
    selectList.length > 0 && (
      <ModalLayout modalStyle={style.content}>
        {design !== "thumbnail" && (
          <ul className={cx(style["list-wrapper"], style["basic-list-wrapper"])}>
            {selectList.map((v, i) => (
              <li className={cx(style["list"])} onClick={() => onChangeSelect(v)} key={v.id}>
                {design === "imageWithText" &&
                  (v.src ? (
                    <picture className={cx(style.image)}>
                      <Image width={100} height={80} src={v.src} alt="image" />
                    </picture>
                  ) : (
                    <div className={cx(style["list-number"])}>
                      <div className={cx(style.number)}>
                        <span>{i + 1}</span>
                      </div>
                    </div>
                  ))}
                {design === "text" && (
                  <div className={cx(style.number)}>
                    <span>{i + 1}</span>
                  </div>
                )}
                <div className={cx(style["list-content"])}>
                  {hasString(v.data.title) && <h3>{v.data.title}</h3>}
                  {hasString(v.data.description) && <p>{v.data.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
        {design === "thumbnail" && (
          <ul className={cx(style["list-wrapper"], style["thumb-list-wrapper"])}>
            {selectList.map((v) => (
              <li onClick={() => onChangeSelect(v)} key={`thumb-list-${v.id}`}>
                <div
                  style={{
                    background: getImageUrl({ isCenter: true, url: hasString(v.src) ? v.src : "/images/noImage.png" }),
                  }}
                  className={cx(style["list-content"])}
                >
                  <div className={cx(style.text)}>
                    {
                      <>
                        {hasString(v.data.title) && <h3>{v.data.title}</h3>}
                        {hasString(v.data.description) && <p>{v.data.description}</p>}
                      </>
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {addSelectNone && (
          <div className={cx(style["btn-wrapper"])}>
            <button onClick={() => onChangeSelect(null)}>
              <span>{t("선택 없음")}</span>
            </button>
          </div>
        )}
      </ModalLayout>
    )
  )
}

export default SelectList
