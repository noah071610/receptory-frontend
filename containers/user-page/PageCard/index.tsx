"use client"

import { inactivePage } from "@/actions/page"
import { deleteSave } from "@/actions/save"
import { queryKey } from "@/config"
import { colors } from "@/config/colors"
import { toastSuccess } from "@/config/toast"
import { useTranslation } from "@/i18n/client"
import { SaveListType } from "@/types/Page"
import hasString from "@/utils/helpers/hasString"
import setDateFormat from "@/utils/helpers/setDate"
import { getAnimation } from "@/utils/styles/getAnimation"
import {
  faArrowUpRightFromSquare,
  faChartLine,
  faChevronDown,
  faClose,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const PageCard = ({
  userId,
  i,
  save: { title, description, thumbnail, format, pageId, updatedAt },
}: {
  save: SaveListType
  i: number
  userId: string
}) => {
  const queryClient = useQueryClient()
  const { lang } = useParams()
  const { t } = useTranslation()
  const { push, replace } = useRouter()
  const [isActive, setIsActive] = useState(format === "active")
  const [isOpen, setIsOpen] = useState(false)
  const onClickList = async (e: any) => {
    const closestElement = e.target.closest("[data-list]")

    if (closestElement) {
      const dataType = closestElement.getAttribute("data-list")

      switch (dataType) {
        case "toggler":
          return
        case "insight":
          break
        case "stop":
          {
            const isOk = await inactivePage({ pageId })
            if (isOk) {
              toastSuccess("페이지를 비활성화 했어요")
              setIsActive(false)
              queryClient.invalidateQueries({ queryKey: queryKey.page(pageId) })
            }
          }
          break
        case "edit":
          replace(`/edit/${userId}/${pageId}`, {
            scroll: false,
          })
          break
        case "gotoPage":
          push(`/${pageId}`)
          break
        case "delete": {
          const isOk = await deleteSave(pageId)
          if (isOk) {
            toastSuccess("페이지를 삭제했어요.")
            queryClient.invalidateQueries({ queryKey: queryKey.save.list })
            queryClient.invalidateQueries({ queryKey: queryKey.page(pageId) })
          }
          break
        }
      }
    } else {
      replace(`/edit/${userId}/${pageId}`, {
        scroll: false,
      })
    }
  }

  const onChangeOpener = () => {
    setIsOpen((b) => !b)
  }

  const list = useMemo(
    () =>
      isActive
        ? [
            { value: "insight", icon: faChartLine },
            { value: "gotoPage", icon: faArrowUpRightFromSquare },
            { value: "stop", icon: faClose },
            { value: "edit", icon: faPen },
            { value: "delete", icon: faTrash },
          ]
        : [
            { value: "edit", icon: faPen },
            { value: "delete", icon: faTrash },
          ],
    [isActive]
  )

  return (
    <li style={getAnimation({ type: "flip", delay: 180 * i })} onClick={onClickList} className={cx("card")}>
      <div className={cx("list-main")}>
        <div className={cx("label")}>
          <span>Gather form</span>
          <div className={cx("active")}>
            <div className={cx("circle")}>
              <div style={{ backgroundColor: isActive ? colors.green : colors.red }}></div>
            </div>
          </div>
        </div>
        <picture>
          <img src={thumbnail ? thumbnail : "/images/noImage.png"} alt="thumbnail" />
        </picture>
        <div className={cx("list-content")}>
          <div className={cx("title")}>
            <h2>{hasString(title) ? title : "타이틀 입력"}</h2>
            <p>{hasString(description) ? description : "타이틀 입력"}</p>
          </div>
          <div className={cx("bottom")}>
            <span className={cx("info")}>
              {t("최근 수정일")}
              {" : "}
              {setDateFormat({ date: new Date(updatedAt), lang, isTime: true })}
            </span>
          </div>
        </div>
        <div className={cx("option-list")}>
          <button data-list="toggler" className={cx("opener", { isOpen })} onClick={onChangeOpener}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
          <ul className={cx({ isOpen, isActive })}>
            {list.map(({ value, icon }) => (
              <li data-list={value} key={`page-option-${value}`}>
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={icon} />
                </div>
                <div className={cx("text")}>
                  <span>{value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

export default PageCard
