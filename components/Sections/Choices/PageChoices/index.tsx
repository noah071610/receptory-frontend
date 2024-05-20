"use client"

import { SectionType } from "@/types/Edit"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "../style.module.scss"

import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import { faCircle } from "@fortawesome/free-regular-svg-icons"
import { faClose, faMars, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageChoices({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { userPick, setUserPick } = useMainStore()
  const {
    data: { title, description },
    design,
    list,
  } = section
  const { value } = userPick[section.id] ?? {}

  const onClickBtn = (text: string, index: number, src?: string) => {
    setUserPick({
      section,
      value: [
        {
          key: `${index}`,
          text,
          src,
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
        {list?.map(({ value: text, type, src }, i) => (
          <div
            onClick={() => onClickBtn(text, i, src)}
            key={`${type}-${i}-display`}
            className={cx("content", design, i === 0 ? "left" : "right", {
              selected: value?.length > 0 && value[0].key === String(i),
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
              <div>
                <picture className={cx("card-thumbnail", "display")}>
                  <img src={hasString(src) ? src : "/images/noImage.png"} alt="image" />
                </picture>
              </div>
            )}

            <div className={cx("text")}>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(PageChoices)
