"use client"

import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { useMainStore } from "@/store/main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faCircle } from "@fortawesome/free-regular-svg-icons"
import { faClose, faMars, faPlus, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Choices({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setActive } = useEditorStore()
  const { selected, setSelected } = useMainStore()
  const {
    data: { title, description },
    design,
    list,
  } = section
  const { value } = selected[section.index - 1] ?? {}

  const onClickThumbnailUpload = (index: number) => {
    setActive({ key: "modal", payload: { type: "choices-image", payload: index } })
  }

  const onClickBtn = (text: string, index: number) => {
    setSelected({
      section,
      value: [
        {
          key: `${index}`,
          text,
        },
      ],
    })
  }

  return (
    <div className={cx("layout")}>
      <label className={cx("title")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </label>
      <div className={cx("choices")}>
        {list?.map(({ value: text, type, src, id }, i) => (
          <div
            onClick={() => onClickBtn(text, i)}
            key={`${type}-${i}`}
            className={cx("content", design, i === 0 ? "left" : "right", {
              selected: value?.length > 0 && value[0].key === id,
            })}
          >
            {design === "basic" && (
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={i === 0 ? faCircle : faClose} />
              </div>
            )}
            {design === "gender" && (
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={i === 0 ? faVenus : faMars} />
              </div>
            )}
            {design === "thumbnail" && (
              <div style={{ background: getImageUrl({ url: src }) }} className={cx("card-thumbnail")}>
                {hasString(src) && <DeleteBtn isSmall={true} listIndex={i} srcKey="choices" />}
                <button className={cx("drop-zone")} onClick={() => onClickThumbnailUpload(i)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            )}

            <div className={cx("text")}>
              <Input
                type="input"
                className={cx("list-title")}
                inputType="list-title"
                isOptional={false}
                value={text}
                listIndex={i}
                section={section}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
      </div>
    </div>
  )
}

export default memo(Choices)
