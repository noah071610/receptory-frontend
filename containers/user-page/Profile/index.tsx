"use client"

import { logout } from "@/actions/user"
import { _url, queryKey, userPlan } from "@/config"
import { colors } from "@/config/colors"
import { toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { UserType } from "@/types/User"
import { faFlag, faGear, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const options = {
  contents: ["template", "guide"],
  settings: ["changeProfile", "changeSiteLang", "logout", "deleteAccount"],
  inform: ["upgrade", "terms-and-policy", "feedback", "report"],
}

const menu = [
  { value: "contents", icon: faWandMagicSparkles },
  { value: "settings", icon: faGear },
  { value: "inform", icon: faFlag },
]

const Profile = ({ user, lang }: { user: UserType; lang: Langs }) => {
  const queryClient = useQueryClient()
  const { push, replace } = useRouter()
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.user })
    },
  })
  const { t } = useTranslation(["user-page"])
  const { setModal } = useMainStore(["setModal"])
  const [selectedOption, setSelectedOption] = useState<null | "settings" | "inform" | "contents">(null)

  const onClickMenu = (value: "settings" | "inform" | "upgrade") => {
    if (selectedOption === value) {
      return setSelectedOption(null)
    }
    if (value === "upgrade") {
      push("/plan")
    } else {
      setSelectedOption(value)
    }
  }

  const onClickSubmenu = async (type: any) => {
    switch (type) {
      case "deleteAccount":
        setModal({
          section: null,
          type: "confirmHard",
          payload: { text: type, value: undefined },
        })
        break
      case "terms-and-policy":
        if (typeof window === "object") {
          window.open(`${_url.client}/terms-and-policy`, "_blank")
        }
        break
      case "changeProfile":
        setModal({
          section: null,
          type: "changeProfile",
        })
        break
      case "changeSiteLang":
        setModal({
          section: null,
          type: "selectLang",
          payload: {
            lang,
            isChangeSiteLang: true,
          },
        })
        break
      case "template":
        if (typeof window === "object") {
          window.open(`${_url.client}/template`)
        }
        break
      case "guide":
        toastSuccess("comingsoon")
        break
      case "logout":
        logoutMutation.mutate()
        const ok = confirm(t("You really want logout?"))
        if (ok) {
          alert(t("logoutSuccess"))
          replace("/login")
        }
        break
      default:
        toastSuccess("comingsoon")
        break
    }
  }

  return (
    <>
      <div className={cx("profile")}>
        <div className={cx("user-icon")}>
          <div style={{ backgroundColor: user.color ?? colors.blue }}>
            <span>{user.userName[0]}</span>
          </div>
        </div>
        <h1>{user.userName}</h1>
        <span className={cx("plan")}>{t(`plan.${userPlan[user.plan]}`)}</span>
        <div className={cx("info-layout")}>
          <ul className={cx("info-menu")}>
            {menu.map(({ value, icon }) => (
              <li key={`user-info-${value}`}>
                <button
                  className={cx({ active: selectedOption === value })}
                  onClick={() => onClickMenu(value as "settings" | "inform" | "upgrade")}
                >
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <span>{t(value)}</span>
                </button>
              </li>
            ))}
          </ul>
          {selectedOption && (
            <ul className={cx("info-submenu")}>
              {options[selectedOption].map((v) => (
                <li key={`submenu-${v}`}>
                  <button onClick={() => onClickSubmenu(v)}>
                    <span>{t(v)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
