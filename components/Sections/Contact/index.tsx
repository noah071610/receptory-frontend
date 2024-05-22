"use client"

import Input from "@/components/Input"
import OptionRatio from "@/components/Options/OptionRatio"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

// https://help.line.me/line/IOSSecondary/categoryId/20009675/3/pc?lang=ko&contentId=20022671

const onClick = {}

function Contact({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { setCollection } = useEditorStore()

  const list = section.collection

  const design = section.design

  const onChangeLink = (inputValue: string, i: number) => {
    setCollection({ payload: inputValue, index: i, key: "link" })
  }

  return (
    <div className={cx("contact")}>
      <div className={cx("main")}>
        <ul className={cx("btn-list", design)}>
          {list.map(({ key, link }, i) => (
            <li key={`btn_${key}`} style={getAnimation({ type: section.style.animation, delay: i * 130 })}>
              <a href={key === "call" ? `tel:${link}` : link} target="_blank" rel="noreferrer">
                <Image width={30} height={30} src={`/images/icons/${key}.png`} alt={key} />
                {design === "card" && <span>{key}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionRatio
            optionsArr={[
              { value: "call", src: "/images/icons/call.png" },
              { value: "email", src: "/images/icons/email.png" },
              { value: "line", src: "/images/icons/line.png" },
              { value: "instagram", src: "/images/icons/instagram.png" },
              { value: "twitter", src: "/images/icons/twitter.png" },
              { value: "facebook", src: "/images/icons/facebook.png" },
              { value: "kakaoTalk", src: "/images/icons/kakaoTalk.png" },
            ]}
            section={section}
            targetKey="contacts"
            isMultiple={true}
          />
          <div className={cx("link-option")}>
            <h4>
              <span>링크 설정</span>
            </h4>
            <ul className={cx("link-input-wrapper")}>
              {list.map(({ key, link }, i) => (
                <li key={`link-input-${key}`}>
                  <Image width={30} height={30} src={`/images/icons/${key}.png`} alt={key} />
                  <Input
                    type="input"
                    inputType={`${key}Placeholder`}
                    className={cx("link-input")}
                    isOptional={false}
                    maxLength={18}
                    onChange={(inputValue: string) => {
                      onChangeLink(inputValue, i)
                    }}
                    dataKey={"title"}
                    value={link}
                    section={section}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
export default memo(Contact)
