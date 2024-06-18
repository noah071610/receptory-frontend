"use client"

import { useEditorStore } from "@/store/editor"
import cs from "classnames/bind"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function EmojiStage({ type }: { type?: string }) {
  const { active, setSrc, setActive, setOptions, setList } = useEditorStore([
    "active",
    "setSrc",
    "setActive",
    "setOptions",
    "setList",
  ])
  const onEmojiClick = (data: EmojiClickData) => {
    switch (type) {
      case "thumbnail":
      case "callout":
        setSrc({
          payload: data.imageUrl,
        })
        setOptions({ payload: "emoji", key: "imageStatus" })
        break

      case "select":
      case "choices":
        setList({
          index: active.modal.payload,
          key: "src",
          payload: data.imageUrl,
        })

        setList({
          index: active.modal.payload,
          key: "options",
          payload: { imageStatus: "emoji" },
        })
        break
    }

    setActive({ payload: { type: null, payload: null }, key: "modal" })
  }
  return (
    <>
      <EmojiPicker
        className={cx("emoji-picker")}
        lazyLoadEmojis={true}
        emojiStyle={"apple" as EmojiStyle}
        allowExpandReactions={false}
        width="100%"
        searchDisabled={true}
        skinTonesDisabled={true}
        onEmojiClick={onEmojiClick}
      />
    </>
  )
}
