"use client"

import { inactivePage } from "@/actions/page"
import { noImageUrl, queryKey } from "@/config"
import { colors } from "@/config/colors"
import { toastSuccess } from "@/config/toast"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveListType } from "@/types/Page"
import hasString from "@/utils/helpers/hasString"
import { setDateFormat } from "@/utils/helpers/setDate"
import { getAnimation } from "@/utils/styles/getAnimation"
import {
  faArrowUpRightFromSquare,
  faChartLine,
  faChevronDown,
  faClose,
  faGlobe,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const defaultList = [
  { value: "edit", icon: faPen },
  { value: "changeLang", icon: faGlobe },
  { value: "delete", icon: faTrash },
]

const PageCard = ({
  userId,
  i,
  lang,
  save: { thumbnailType, title, description, thumbnail, format, pageId, updatedAt, customLink, lang: pageLang },
}: {
  save: SaveListType
  i: number
  userId: string
  lang: Langs
}) => {
  const queryClient = useQueryClient()
  const { setModal } = useMainStore(["setModal"])
  const { t } = useTranslation(["user-page"])
  const { push } = useRouter()
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
          push(`/insight/${userId}/${pageId}`)
          break
        case "stop":
          {
            const isOk = await inactivePage({ pageId })
            if (isOk) {
              toastSuccess("inactive")
              setIsActive(false)
              queryClient.invalidateQueries({ queryKey: queryKey.page(pageId) })
            }
          }
          break
        case "edit":
          push(`/edit/${userId}/${pageId}`, {
            scroll: false,
          })
          break
        case "changeLang":
          setModal({
            section: null,
            type: "selectLang",
            payload: {
              pageId,
              lang: pageLang,
            },
          })
          break
        case "gotoPage":
          window.open(`/page/${customLink}`, "_blank")
          break
        case "delete": {
          setModal({
            section: null,
            type: "confirmHard",
            payload: {
              text: "deletePage",
              value: pageId,
            },
          })
          break
        }
      }
    } else {
      push(`/edit/${userId}/${pageId}`, {
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
            ...defaultList,
          ]
        : defaultList,
    [isActive]
  )

  return (
    <li style={getAnimation({ type: "fadeUp", delay: 180 * i })} onClick={onClickList} className={cx("card")}>
      <div className={cx("list-main")}>
        <div className={cx("label")}>
          <div className={cx("label-right")}>
            <Image src={`/images/icons/${pageLang}.png`} width={20} height={20} alt="card-flag" />
            <span>Receptori form</span>
          </div>

          <div className={cx("active")}>
            <div className={cx("circle")}>
              <div style={{ backgroundColor: isActive ? colors.green : colors.red }}></div>
            </div>
          </div>
        </div>
        <div className={cx("thumbnail", thumbnailType)}>
          <div className={cx("thumbnail-inner")}>
            <picture>
              <img src={hasString(thumbnail) ? thumbnail : noImageUrl} alt="thumbnail" />
            </picture>
          </div>
        </div>
        <div className={cx("list-content")}>
          <div className={cx("title")}>
            <h2>{hasString(title) ? title : t("defaultTitle")}</h2>
            <p>{hasString(description) ? description : t("defaultDescription")}</p>
          </div>
          <div className={cx("bottom")}>
            <span className={cx("info")}>
              {t("updatedAt")}
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
                  <span>{t(`card.${value}`)}</span>
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
