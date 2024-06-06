"use client"

import { noImageUrl } from "@/config"
import { InsightPageType } from "@/types/Insight"
import { UserType } from "@/types/User"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

const PageInfo = ({ user, pageData }: { user: UserType; pageData: InsightPageType }) => {
  return (
    <>
      <div className={cx("page-info")}>
        <picture>
          <img
            src={hasString(pageData.thumbnail) ? pageData.thumbnail : noImageUrl}
            alt={`${pageData.pageId}_thumbnail`}
          />
        </picture>
        <h1>{pageData.title}</h1>
        {hasString(pageData.description) && <span className={cx("description")}>{pageData.description}</span>}
      </div>
    </>
  )
}

export default PageInfo
