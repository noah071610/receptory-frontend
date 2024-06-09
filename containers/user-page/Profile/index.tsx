"use client"

import { userPlan } from "@/config"
import { useTranslation } from "@/i18n/client"
import { _useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { UserType } from "@/types/User"
import { faFire, faFlag, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useRouter } from "next/navigation"
import { useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const options = {
  settings: ["changeProfile", "deleteAccount"],
  inform: ["feedback", "report"],
}

const menu = [
  { value: "settings", icon: faGear },
  { value: "inform", icon: faFlag },
  { value: "upgrade", icon: faFire },
]

const Profile = ({ user, lang }: { user: UserType; lang: Langs }) => {
  // todo:
  const { t } = useTranslation(lang, ["user-page"])
  const { push } = useRouter()
  const { setModal } = _useMainStore()
  const [selectedOption, setSelectedOption] = useState<null | "settings" | "inform">(null)

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

  const onClickSubmenu = (type: any) => {
    if (type === "deleteAccount") {
      setModal({
        section: null,
        type: "confirmHard",
        payload: { text: type, value: undefined },
      })
    }
  }
  return (
    <>
      <div className={cx("profile")}>
        <picture>
          <img width={120} height={120} src={user.userImage} alt={`${user.userName}_profile`} />
        </picture>
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
