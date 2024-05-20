"use client"

import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Providers({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setList, selectedSection, setSelectedSection } = useEditorStore()

  const onClickAddContact = (i: number) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setList({ payload: !section.list[i].isActive, key: "isActive", index: i })
  }

  const onChangeListInput = (e: any, i: number) => {
    setList({ payload: e.target.value, key: "value", index: i })
  }
  const onBlurInput = (i: number) => {
    if (i === 0) {
      const matchedText = section.list[0].value.match(/[0-9]/gi)
      setList({ payload: (matchedText ?? []).join(""), key: "value", index: 0 })
      // if (matchedText?.length > 0) {
      //   saveSectionHistory({ payload: section })
      // }
      return
    }
    if (i === 1 && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(section.list[1].value)) {
      return setList({ payload: "", key: "value", index: 1 })
    }
    // return saveSectionHistory({ payload: section })
  }
  return (
    <div className={cx("providers")}>
      <ul>
        {section.list.map((v, i) => (
          <li key={`provider_${i}`}>
            <div className={cx("list")}>
              <div className={cx("left")}>
                <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
              </div>
              <div className={cx("right")}>
                <h4>{t(`${v.type}Link`)}</h4>
                <input
                  type={v.type === "email" ? "email" : undefined}
                  placeholder={t(`${v.type}Placeholder`)}
                  className={cx("input")}
                  onBlurCapture={() => onBlurInput(i)}
                  onChange={(e) => onChangeListInput(e, i)}
                  value={v.value ?? ""}
                />
              </div>
              <div className={cx("end")}>
                <button onClick={() => onClickAddContact(i)} className={cx("checkbox", { active: v.isActive })}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
