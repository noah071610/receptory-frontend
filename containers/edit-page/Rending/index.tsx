"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Rending({}: {}) {
  const { t } = useTranslation()
  const { pageOptions, setPageOptions } = useEditorStore()
  const { format, lang: targetLang, customLink } = pageOptions
  const onClickSlider = () => {
    setPageOptions({ type: "format", payload: pageOptions.format === "active" ? "inactive" : "active" })
  }
  const onClickRatio = (v: Langs) => {
    setPageOptions({ type: "lang", payload: v })
  }
  const onChangeLinkName = (e: any) => {
    const str = e.target.value
    if (str.length > 20) return
    const pattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/
    if (pattern.test(str)) return alert("!!todo:")
    setPageOptions({ type: "customLink", payload: str })
  }
  return (
    <div className={cx("layout")}>
      <h1>
        <img src="/images/icons/user.png" /> <span>거의 다 왔어요!</span>
      </h1>

      <div className={cx(style.options)}>
        <div className={cx("option-bar")}>
          <h3>{t("format")}</h3>
          <button onClick={onClickSlider} className={cx("content", { active: format === "active" })}>
            <div className={cx("bar")}>
              <div className={cx("circle")}></div>
            </div>
          </button>
        </div>

        <div className={cx("option-ratio")}>
          <h3>{t("lang")}</h3>
          <div className={cx("content")}>
            {["ko", "en", "ja", "th"].map((v) => (
              <div
                key={`lang-${v}`}
                onClick={() => onClickRatio(v as Langs)}
                className={cx("ratio-wrapper", { active: targetLang === v })}
              >
                <div className={cx("ratio")}>
                  <div className={cx("circle")}></div>
                </div>
                <div className={cx("label")}>
                  <label>{t(`${v}`)}</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cx("option-link")}>
          <h3>{t("customLink")}</h3>
          <input value={customLink} onChange={onChangeLinkName} />
        </div>
      </div>

      <div className={cx("deploy-wrapper")}>
        <button className={cx("deploy")}>
          <span>배포하기</span>
        </button>
      </div>
    </div>
  )
}
