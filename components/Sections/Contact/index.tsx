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

function Contact({
  section,
  isDisplayMode,
  isEditor,
}: {
  section: SectionType
  isDisplayMode?: boolean
  isEditor?: boolean
}) {
  const { lang } = useParams()
  const { t } = useTranslation()
  const { setCollection } = useEditorStore()

  const list = section.collection

  const design = section.design

  const onChangeLink = (value: string, i: number, key: "description" | "link") => {
    setCollection({ payload: value, index: i, key })
  }

  return (
    <div className={cx("contact")}>
      <div className={cx("main")}>
        <ul className={cx("btn-list", design)}>
          {list.map(({ key, link, description }, i) => (
            <li key={`btn_${key}`} style={getAnimation({ type: section.style.animation, delay: i * 130 })}>
              {isEditor ? (
                <div className={cx("preview-btn")}>
                  <Image width={40} height={40} src={`/images/icons/${key}.png`} alt={key} />
                  {design === "card" && <span>{description}</span>}
                </div>
              ) : (
                <a href={key === "call" ? `tel:${link}` : link} target={"_blank"} rel="noreferrer">
                  <Image width={40} height={40} src={`/images/icons/${key}.png`} alt={key} />
                  {design === "card" && <span>{description}</span>}
                </a>
              )}
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
              {list.map(({ key, link, description }, i) => (
                <li key={`link-input-${key}`}>
                  <Image width={30} height={30} src={`/images/icons/${key}.png`} alt={key} />
                  <div className={cx("input-content")}>
                    <h5>링크 설명</h5>
                    <Input
                      type="input"
                      inputType={`${key}Placeholder`}
                      isOptional={true}
                      onChange={(value: string) => {
                        onChangeLink(value, i, "description")
                      }}
                      value={description}
                      section={section}
                    />
                    <h5>링크 url</h5>
                    <Input
                      type="input"
                      inputType={`${key}Placeholder`}
                      isOptional={false}
                      onChange={(value: string) => {
                        onChangeLink(value, i, "link")
                      }}
                      value={link}
                      section={section}
                    />
                  </div>
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
