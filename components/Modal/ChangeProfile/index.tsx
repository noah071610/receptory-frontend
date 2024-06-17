"use client"

import { useTranslation } from "react-i18next"
import ModalLayout from ".."
import style from "./style.module.scss"

import { profileChange } from "@/actions/user"
import { queryKey } from "@/config"
import { colors } from "@/config/colors"
import { toastError, toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { UserType } from "@/types/User"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import { useState } from "react"
import { RgbaColorPicker } from "react-colorful"
const cx = cs.bind(style)

function rgbaStringToObject(rgbaString: string) {
  // rgba 문자열에서 각 색상 값 추출
  if (!rgbaString) return { r: 0, g: 0, b: 0, a: 1 }
  const rgbaValues = rgbaString.match(/[\d.]+/g)

  if (!rgbaValues?.length) return { r: 0, g: 0, b: 0, a: 1 }

  // 추출된 값으로 객체 생성
  const obj = {
    r: parseInt(rgbaValues[0]),
    g: parseInt(rgbaValues[1]),
    b: parseInt(rgbaValues[2]),
    a: parseFloat(rgbaValues[3]),
  }

  return obj
}

export const ChangeProfile = ({ user, setIsLoading }: { user: UserType; setIsLoading: (b: boolean) => void }) => {
  const queryClient = useQueryClient()
  const { setModal } = useMainStore(["setModal", "selected"])
  const { t } = useTranslation(["modal", "messages"])
  const [input, setInput] = useState({
    color: user.color ?? colors.blue,
    userName: user.userName,
  })
  const onChangeInput = (e: any, type: "userName" | "color") => {
    if (type === "userName") {
      if (input.userName.length > 20) return
    }
    setInput((v) => ({ ...v, [type]: e.target.value }))
  }

  const onSubmitForm = async (e: any) => {
    e.preventDefault()

    if (input.userName.length === 0) {
      // 비밀번호가 일치하지 않습니다.
      return toastError("userNameLength")
    }

    setIsLoading(true)

    const isOk = await profileChange(input)

    if (isOk) {
      await queryClient.invalidateQueries({ queryKey: queryKey.user })
      setTimeout(() => {
        toastSuccess("changeProfile")
        setIsLoading(false)
        setModal({ section: null, type: null })
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }

  const selectColor = (color: any) => {
    setInput((v) => ({ ...v, color: `rgba(${color.r},${color.g},${color.b},${color.a})` }))
  }

  return (
    <ModalLayout modalStyle={style["change-profile-content"]}>
      <h1>{t("profileSetting")}</h1>
      <div className={cx("preview")}>
        <div className={cx("user-icon")}>
          <div style={{ backgroundColor: input.color }}>
            <span>{input.userName[0]}</span>
          </div>
        </div>
        <div className={cx("color-picker")}>
          <RgbaColorPicker className={style.picker} color={rgbaStringToObject(input.color)} onChange={selectColor} />
        </div>
      </div>
      <form onSubmit={onSubmitForm}>
        <label className={cx("title")}>
          <h2>{t("setUserName")}</h2>
        </label>
        <input
          placeholder={t("enterUserName")}
          value={input.userName}
          onChange={(e) => onChangeInput(e, "userName")}
        ></input>
        <div className={cx("btn-wrapper")}>
          <button
            disabled={!input.color || !input.userName}
            className={cx({
              inactive: !input.color || !input.userName,
            })}
            type="submit"
          >
            <span>{t("submitSetting")}</span>
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}

export default ChangeProfile
