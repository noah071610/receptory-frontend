"use client"

import style from "@/containers/edit-page/style.module.scss"
import { useMainStore } from "@/store/main"
import classNames from "classNames"
const cx = classNames.bind(style)

const UserPage = () => {
  const { user } = useMainStore()
  console.log(user)

  return <></>
}

export default UserPage
