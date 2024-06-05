"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { submit } from "@/actions/page"
import { toastError } from "@/config/toast"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
const cx = cs.bind(style)

export const MakePassword = ({
  confirmId,
  setIsConfirm,
  setIsConfirming,
}: {
  confirmId: string
  setIsConfirm: (b: boolean) => void
  setIsConfirming: (b: boolean) => void
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { pageId } = useParams()
  const { t } = useTranslation()
  const { setModal, selected } = useMainStore()
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  })
  const onChangeInput = (e: any, type: "password" | "confirmPassword") => {
    setPassword((v) => ({ ...v, [type]: e.target.value }))
  }

  const onClickConfirm = async () => {
    if (typeof pageId !== "string") {
      return toastError("잘못된 접근입니다.")
    }
    if (password.password !== password.confirmPassword) {
      return toastError("비밀번호가 일치하지 않습니다.")
    }

    if (password.password.length < 5) {
      return toastError("패스워드는 최소 5글자 이상을 입력해주세요.")
    }
    setIsConfirming(true)

    const isOk = await submit({ pageId, confirmId, password: password.password, selected })

    if (isOk) {
      setTimeout(() => {
        setIsConfirming(false)
        setIsConfirm(true)
        setPassword({
          password: "",
          confirmPassword: "",
        })
        setModal({ section: null, type: null })
        replace(`${pathname}?s=confirm`)
      }, 1000)
    }
  }

  return (
    <ModalLayout modalStyle={style["confirm-hard-content"]}>
      <h1>패스워드를 작성해주세요</h1>
      <p className={cx("desc")}>
        제출한 정보를 확인하기 위한 비밀번호가 필요해요 <br /> 확인번호는 나중에 예약 확인에 꼭 필요하니 따로
        기억해주세요.
      </p>
      <label className={cx("title")}>
        <h2>접수번호</h2>
        <p>예약확인을 위해 필요합니다.</p>
      </label>
      <input className={cx("confirmId")} disabled={true} value={confirmId} type="text"></input>
      <label className={cx("title")}>
        <h2>비밀번호 설정</h2>
      </label>
      <input
        placeholder={"비밀번호 입력"}
        value={password.password}
        onChange={(e) => onChangeInput(e, "password")}
        type="password"
      ></input>
      <input
        className={cx("confirmPassword")}
        placeholder={"비밀번호 확인"}
        value={password.confirmPassword}
        onChange={(e) => onChangeInput(e, "confirmPassword")}
        type="password"
      ></input>
      <div className={cx("btn-wrapper")}>
        <button
          disabled={!password.password || !password.confirmPassword}
          className={cx({
            inactive: !password.password || !password.confirmPassword,
          })}
          onClick={onClickConfirm}
        >
          {t("설정 완료")}
        </button>
      </div>
    </ModalLayout>
  )
}

export default MakePassword
