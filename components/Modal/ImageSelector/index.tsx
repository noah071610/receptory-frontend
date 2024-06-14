"use client"

import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import cs from "classNames/bind"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import EmojiStage from "./EmojiStage"
import ImageStage from "./ImageStage"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageSelector({
  setIsLoading,
  lang,
  IsUseEmoji,
}: {
  setIsLoading: (b: boolean) => void
  IsUseEmoji?: boolean
  lang: Langs
}) {
  const { t } = useTranslation(["modal"])
  const [curStage, setCurStage] = useState<"emoji" | "image">(IsUseEmoji ? "emoji" : "image")

  const { active } = useEditorStore(["active"])

  const type = active.modal.type?.replace("-image", "")

  const isMultiple = type === "album" || type === "slider"

  const onClickStage = (type: "emoji" | "image") => {
    setCurStage(type)
  }

  return (
    <ModalLayout modalStyle={style.content}>
      {IsUseEmoji && (
        <div className={cx("menu")}>
          <button className={cx({ active: curStage === "emoji" })} onClick={() => onClickStage("emoji")}>
            <span>{t("emoji")}</span>
          </button>
          <button className={cx({ active: curStage === "image" })} onClick={() => onClickStage("image")}>
            <span>{t("image")}</span>
          </button>
        </div>
      )}
      <div className={cx("main")}>
        {curStage === "emoji" ? (
          <EmojiStage type={type} />
        ) : (
          <ImageStage lang={lang} isMultiple={isMultiple} setIsLoading={setIsLoading} type={type} />
        )}
      </div>
    </ModalLayout>
  )
}
