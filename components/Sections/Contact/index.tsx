"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Providers = ({ section }: { section: SectionType }) => {
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
      setList({ payload: (section.list[0].value.match(/[0-9]/gi) ?? []).join(""), key: "value", index: 0 })
    }
    if (i === 1 && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(section.list[1].value)) {
      setList({ payload: "", key: "value", index: 1 })
    }
  }
  return (
    <div className={cx(style.providers)}>
      <ul>
        {section.list.map((v, i) => (
          <li key={`provider_${i}`}>
            <div className={cx(style.list)}>
              <div className={cx(style.left)}>
                <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
              </div>
              <div className={cx(style.right)}>
                <h4>{t(`${v.type}Link`)}</h4>
                <input
                  type={v.type === "email" ? "email" : undefined}
                  placeholder={t(`${v.type}Placeholder`)}
                  className={cx(style.input)}
                  onBlurCapture={() => onBlurInput(i)}
                  onChange={(e) => onChangeListInput(e, i)}
                  value={v.value ?? ""}
                />
              </div>
              <div className={cx(style.end)}>
                <button
                  onClick={() => onClickAddContact(i)}
                  className={cx(style.checkbox, { [style.active]: v.isActive })}
                >
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

function Contact({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation()

  const btnList = useMemo(() => section.list.filter((v) => v.isActive), [section.list])

  return (
    <div className={cx(style["contact"])}>
      <div className={cx(style.main)}>
        <div className={cx(style["btn-list"])}>
          {btnList.map((v, i) => {
            switch (v.type) {
              case "call":
                return (
                  <a
                    style={getAnimation(section.style.animation, i * 130)}
                    href={`tel:${v.value}`}
                    key={`btn_${v.type}`}
                  >
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </a>
                )
              default:
                return (
                  <button
                    style={getAnimation(section.style.animation, i * 130)}
                    // onClick={() => v.onClick(v.value)} todo:
                    key={`btn_${v.type}`}
                  >
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </button>
                )
            }
          })}
        </div>
      </div>
      {!isDisplayMode && <Providers section={section} />}
    </div>
  )
}
export default memo(Contact)
