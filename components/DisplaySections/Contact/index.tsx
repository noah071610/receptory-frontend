"use client"

import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Contact({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["todo:"])

  const btnList = useMemo(() => section.list.filter((v) => v.isActive), [section.list])

  return (
    <div className={cx(style["contact"])}>
      <div className={cx(style.main)}>
        {section.design === "basic" ? (
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
        ) : (
          <div className={cx(style.providers)}>
            <ul>
              {btnList.map((v, i) => (
                <li
                  // onClick={() => v.onClick(v.value)} todo:
                  style={getAnimation(section.style.animation, i * 130)}
                  key={`provider_${i}`}
                >
                  <div className={cx(style.list)}>
                    <div className={cx(style.left)}>
                      <Image width={30} height={30} src={`/images/icons/${v.type}.png`} alt={v.type} />
                    </div>
                    <div className={cx(style.right)}>
                      <h4>{t(`${v.type}`)}</h4>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
export default memo(Contact)
