"use client"

import { userPlan } from "@/config"
import { useMainStore } from "@/store/main"
import { UserType } from "@/types/User"
import { faFire, faFlag, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const options = {
  settings: ["changeProfile", "deleteAccount"],
  report: ["feedback", "report"],
}

const menu = [
  { value: "settings", icon: faGear },
  { value: "report", icon: faFlag },
  { value: "upgrade", icon: faFire },
]

const Profile = ({ user }: { user: UserType }) => {
  const { push } = useRouter()
  const { setModal } = useMainStore()
  const [selectedOption, setSelectedOption] = useState<null | "settings" | "report">(null)

  const onClickMenu = (value: "settings" | "report" | "upgrade") => {
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
        <div className={cx("background")}></div>
        <picture>
          <Image width={120} height={120} src={user.userImage} alt={`${user.userName}_profile`} />
        </picture>
        <h1>{user.userName}</h1>
        <span className={cx("plan")}>{userPlan[user.plan]}</span>
        <div className={cx("info-layout")}>
          <ul className={cx("info-menu")}>
            {menu.map(({ value, icon }) => (
              <li key={`user-info-${value}`}>
                <button
                  className={cx({ active: selectedOption === value })}
                  onClick={() => onClickMenu(value as "settings" | "report" | "upgrade")}
                >
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <span>{value}</span>
                </button>
              </li>
            ))}
          </ul>
          {selectedOption && (
            <ul className={cx("info-submenu")}>
              {options[selectedOption].map((v) => (
                <li key={`submenu-${v}`}>
                  <button onClick={() => onClickSubmenu(v)}>
                    <span>{v}</span>
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
