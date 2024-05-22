"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { findReservation } from "@/actions/page"
import { toastError } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import setDateFormat from "@/utils/helpers/setDate"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

export const ConfirmReservation = ({
  setIsConfirming,
  setIsConfirm,
  pageLang,
}: {
  setIsConfirming: (b: boolean) => void
  setIsConfirm: (b: boolean) => void
  pageLang: Langs
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { pageId } = useParams()
  const { t } = useTranslation()
  const { setModal, loadUserPick, setConfirmation } = useMainStore()
  const [input, setInput] = useState({
    confirmId: "",
    password: "",
  })
  const onChangeInput = (e: any, type: "password" | "confirmId") => {
    setInput((v) => ({ ...v, [type]: e.target.value }))
  }

  const onClickConfirm = async () => {
    if (typeof pageId !== "string") {
      return toastError("잘못된 접근입니다.")
    }
    setIsConfirming(true)

    const { msg, data } = await findReservation({
      pageId,
      confirmId: input.confirmId,
      password: input.password,
    })

    const { saveUserPick, createdAt } = data ?? {}

    if (saveUserPick && createdAt) {
      setConfirmation({
        curConfirmationId: input.confirmId,
        confirmDate: setDateFormat({ date: createdAt, lang: pageLang, isTime: true }),
      })
      loadUserPick(saveUserPick)
      setTimeout(() => {
        setIsConfirming(false)
        setIsConfirm(true)
        setInput({
          password: "",
          confirmId: "",
        })
        replace(`${pathname}?s=confirm`)
        setModal({ section: null, type: null })
      }, 1000)
    } else {
      toastError(msg)
      setIsConfirming(false)
    }
  }

  return (
    <ModalLayout modalStyle={style["content"]}>
      <h1>예약확인</h1>
      <p className={cx("desc")}>예약을 확인하기 위한 접수번호와 비밀번호를 작성해주세요</p>
      <label className={cx("title")}>
        <h2>접수번호</h2>
      </label>
      <input
        className={cx("confirmId")}
        onChange={(e) => onChangeInput(e, "confirmId")}
        value={input.confirmId}
        type="text"
      ></input>
      <label className={cx("title")}>
        <h2>비밀번호</h2>
      </label>
      <input
        placeholder={"비밀번호 입력"}
        value={input.password}
        onChange={(e) => onChangeInput(e, "password")}
        type="password"
      ></input>
      <div className={cx("btn-wrapper")}>
        <button
          disabled={!input.password || !input.confirmId}
          className={cx({
            inactive: !input.password || !input.confirmId,
          })}
          onClick={onClickConfirm}
        >
          {t("예약 확인")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default ConfirmReservation
