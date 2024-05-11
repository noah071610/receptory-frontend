"use client"

import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { memo } from "react"
import style from "./style.module.scss"

import Input from "@/components/Input"
import { useMainStore } from "@/store/main"
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Choices({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setActive } = useEditorStore()
  const { setModal, selects } = useMainStore()
  const { title, description } = section.data
  const design = section.design

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
      <label className={cx("title")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </label>
      <div className={cx("choices")}>
        <button className={cx("content")}>
          <div className={cx("icon")}>
            {design === "basic" && <div></div>}
            {design === "gender" && (
              <div>
                <FontAwesomeIcon icon={faVenus} />
              </div>
            )}
            {design === "thumbnail" && <div></div>}
          </div>
          <div className={cx("text")}>
            {isDisplayMode ? (
              <p>{section.list[0].value}</p>
            ) : (
              <Input
                type="input"
                className={cx("list-title")}
                inputType="list-title"
                isOptional={true}
                value={section.list[0].value}
                listIndex={0}
                section={section}
              />
            )}
          </div>
        </button>
        <button className={cx("content")}>
          <div className={cx("icon")}>
            {design === "basic" && <div></div>}
            {design === "gender" && (
              <div>
                <FontAwesomeIcon icon={faMars} />
              </div>
            )}
            {design === "thumbnail" && <div></div>}
          </div>
          <div className={cx("text")}>
            {isDisplayMode ? (
              <p>{section.list[1].value}</p>
            ) : (
              <Input
                type="input"
                className={cx("list-title")}
                inputType="list-title"
                isOptional={true}
                value={section.list[1].value}
                listIndex={1}
                section={section}
              />
            )}
          </div>
        </button>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionTitleInputs section={section} />
        </div>
      )}
    </div>
  )
}

export default memo(Choices)
