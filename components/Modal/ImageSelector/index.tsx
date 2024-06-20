"use client"

import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import cs from "classnames/bind"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import EmojiStage from "./EmojiStage"
import ImageUrlStage from "./ImageUrlStage"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageSelector({
  setIsLoading,
  lang,
  isUseEmoji,
}: {
  setIsLoading: (b: boolean) => void
  isUseEmoji?: boolean
  lang: Langs
}) {
  const { t } = useTranslation(["modal"])
  const [curStage, setCurStage] = useState<"emoji" | "image" | "imageUrl">(isUseEmoji ? "emoji" : "imageUrl")

  const { active } = useEditorStore(["active"])

  const type = active.modal.type?.replace("-image", "")

  const isMultiple = type === "album" || type === "slider"

  const onClickStage = (type: "emoji" | "image" | "imageUrl") => {
    setCurStage(type)
  }

  return (
    <ModalLayout modalStyle={style.content}>
      <div className={cx("menu")}>
        {isUseEmoji && (
          <button className={cx({ active: curStage === "emoji" })} onClick={() => onClickStage("emoji")}>
            <span>{t("emoji")}</span>
          </button>
        )}
        <button className={cx({ active: curStage === "imageUrl" })} onClick={() => onClickStage("imageUrl")}>
          <span>{t("imageUrl")}</span>
        </button>
        {/* <button className={cx({ active: curStage === "image" })} onClick={() => onClickStage("image")}>
          <span>{t("image")}</span>
        </button> */}
      </div>
      <div className={cx("main")}>
        {curStage === "emoji" && <EmojiStage type={type} />}
        {/* {curStage === "image" && (
          <ImageStage lang={lang} isMultiple={isMultiple} setIsLoading={setIsLoading} type={type} />
        )} */}
        {curStage === "imageUrl" && <ImageUrlStage type={type} setIsLoading={setIsLoading} />}
      </div>
    </ModalLayout>
  )
}
