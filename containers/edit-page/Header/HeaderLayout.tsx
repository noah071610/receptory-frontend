"use client"

import cs from "classnames/bind"
import { ReactNode, useEffect, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function HeaderLayout({ children }: { children: ReactNode }) {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 100)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollPos, visible])

  return (
    <>
      <header className={cx("header", { visible })}>{children}</header>
    </>
  )
}

export default HeaderLayout
