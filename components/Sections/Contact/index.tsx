"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import Image from "next/image"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Contact({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setSection } = useEditStore()
  const { t } = useTranslation(lang, ["todo:"])
  const onClickAddContact = (i: number) => {
    setSection({ payload: !section.list[i].isActive, key: "isActive", type: "list", arrIndex: i })
  }

  return (
    <div className={cx(style["contact"])}>
      <div className={cx(style.main)}></div>
      <div className={cx(style.providers)}>
        <ul>
          {section.list.map((v, i) => (
            <li key={`provider_${i}`}>
              <div className={cx(style.list)}>
                <div className={cx(style.left)}>
                  <Image width={30} height={30} src={`/images/icons/${v.value}.png`} alt={v.value} />
                </div>
                <div className={cx(style.right)}>
                  <h4>{t(`${v.value}`)}</h4>
                  <Input
                    className={cx(style.input)}
                    inputType="contact"
                    isOptional={false}
                    value={section.values[i] ?? ""}
                    targetIndex={i}
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
