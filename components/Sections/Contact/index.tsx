"use client"

import Textarea from "@/components/Textarea"
import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Contact({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const [callNumber, setCallNumber] = useState("")
  const { setSection, selectedSection, setSelectedSection } = useEditStore()
  const { t } = useTranslation(lang, ["todo:"])
  const onClickAddContact = (i: number) => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    setSection({ payload: !section.list[i].isActive, key: "isActive", type: "list", arrIndex: i })
  }

  const btnList = useMemo(() => section.list.filter((v) => v.isActive), [section.list])
  const onChangeInput = (e: any, i: number) => {
    setSection({ payload: e.target.value, key: "value", type: "list", arrIndex: i })
  }
  const onBlurInput = (i: number) => {
    if (i === 0) {
      setSection({ payload: section.list[0].value.match(/[0-9]/gi).join(""), key: "value", type: "list", arrIndex: 0 })
    }
    if (i === 1 && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(section.list[1].value)) {
      setSection({ payload: "", key: "value", type: "list", arrIndex: 1 })
    }
  }

  return (
    <div className={cx(style["contact"])}>
      <div className={cx(style.main)}>
        <Textarea inputType="title" isOptional={true} value={section.value} className={cx(style.title)} />
        <div className={cx(style["btn-list"])}>
          {btnList.map((v, i) => {
            switch (v.type) {
              case "call":
                return (
                  <a href={`tel:${section.values[i]}`} key={`btn_${v.type}`}>
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </a>
                )
              default:
                return (
                  <button onClick={() => v.onClick(section.values[i])} key={`btn_${v.type}`}>
                    <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                  </button>
                )
            }
          })}
        </div>
      </div>
      <div className={cx(style.providers)}>
        <ul>
          {section.list.map((v, i) => (
            <li key={`provider_${i}`}>
              <div className={cx(style.list)}>
                <div className={cx(style.left)}>
                  <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                </div>
                <div className={cx(style.right)}>
                  <h4>{t(`${v.type}`)}</h4>
                  <input
                    type={v.type === "email" ? "email" : undefined}
                    placeholder={t(v.type)}
                    className={cx(style.input)}
                    onBlurCapture={() => onBlurInput(i)}
                    onChange={(e) => onChangeInput(e, i)}
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
    </div>
  )
}
