"use client"

import IconBtn from "@/components/IconBtn"
import { noImageUrl } from "@/config"
import { InsightPageType } from "@/types/Insight"
import hasString from "@/utils/helpers/hasString"
import { faChartLine, faHome, faList } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const menu = [
  { value: "insight", icon: faChartLine },
  { value: "list", icon: faList },
]

const PageInfo = ({
  selectedSection,
  setSelectedSection,
  pageData,
}: {
  selectedSection: "insight" | "list"
  setSelectedSection: (menu: "insight" | "list") => void
  pageData: InsightPageType
}) => {
  const { userId } = useParams()
  const { push } = useRouter()
  const { t } = useTranslation(["insight-page"])
  return (
    <>
      <div className={cx("page-info")}>
        <IconBtn onclick={() => push(`/user/${userId}`)} className={cx("back")} icon={faHome} size={30} />
        <picture>
          <img
            src={hasString(pageData.thumbnail) ? pageData.thumbnail : noImageUrl}
            alt={`${pageData.pageId}_thumbnail`}
          />
        </picture>
        <h1>{pageData.title}</h1>
        {hasString(pageData.description) && <span className={cx("description")}>{pageData.description}</span>}
        <div className={cx("info-layout")}>
          <ul className={cx("info-menu")}>
            {menu.map(({ value, icon }) => (
              <li key={`user-info-${value}`}>
                <button
                  className={cx({ active: selectedSection === value })}
                  onClick={() => setSelectedSection(value as "insight" | "list")}
                >
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <span>{t(value)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default PageInfo
