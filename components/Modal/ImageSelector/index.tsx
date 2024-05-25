"use client"

import { useEditorStore } from "@/store/editor"
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
  IsUseEmoji,
}: {
  setIsLoading: (b: boolean) => void
  IsUseEmoji?: boolean
}) {
  const { t } = useTranslation()
  const [curStage, setCurStage] = useState<"emoji" | "image">(IsUseEmoji ? "emoji" : "image")

  const { active } = useEditorStore()

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
            <span>이모티콘</span>
          </button>
          <button className={cx({ active: curStage === "image" })} onClick={() => onClickStage("image")}>
            <span>이미지</span>
          </button>
        </div>
      )}
      <div className={cx("main")}>
        {curStage === "emoji" ? (
          <EmojiStage type={type} />
        ) : (
          <ImageStage isMultiple={isMultiple} setIsLoading={setIsLoading} type={type} />
        )}
      </div>
    </ModalLayout>
  )
}
