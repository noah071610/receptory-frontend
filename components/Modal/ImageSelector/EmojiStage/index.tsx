"use client"

import { useEditorStore } from "@/store/editor"
import cs from "classnames/bind"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function EmojiStage({ type }: { type?: string }) {
  const { setSrc, setActive, setOptions } = useEditorStore(["setSrc", "setActive", "setOptions"])
  const onEmojiClick = (data: EmojiClickData) => {
    switch (type) {
      case "thumbnail":
      case "callout":
        setSrc({
          payload: data.imageUrl,
        })
        setOptions({ payload: "emoji", key: "imageStatus" })
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
