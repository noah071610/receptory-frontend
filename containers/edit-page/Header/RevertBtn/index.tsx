"use client"

import IconBtn from "@/components/IconBtn"
import { useEditorStore } from "@/store/editor"
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import style from "./style.module.scss"

function RevertBtn() {
  const { setRevert, revert, revertIndex } = useEditorStore(["setRevert", "revert", "revertIndex"])

  const onClickRevert = (type: "do" | "undo") => {
    setRevert(type)
  }

  return (
    <>
      <IconBtn
        disabled={revert.length <= 1 || revertIndex <= 0}
        onclick={() => onClickRevert("undo")}
        iconClassName={style.rollback}
        icon={faRotateLeft}
      />
      <IconBtn
        disabled={revert.length - 1 === revertIndex}
        onclick={() => onClickRevert("do")}
        iconClassName={style.rollback}
        icon={faRotateRight}
      />
    </>
  )
}

export default RevertBtn
