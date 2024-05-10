"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { EditorFooterList, EditorFooterListActions, SectionListTypes } from "@/types/Edit"
import getId from "@/utils/helpers/getId"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
// import { Bounce, toast } from "react-toastify"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = cs.bind(style)

export default function List({
  list,
  isSectionList,
  isOpenAllList,
}: {
  list: EditorFooterList[]
  isSectionList: boolean
  isOpenAllList: boolean
}) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const { lang } = useParams()
  const { addSection, formSections, setActive, active } = useEditorStore()
  const { t } = useTranslation()

  const onClickList = (value: string, type: EditorFooterListActions) => {
    switch (type) {
      case "createSection":
        const newId = getId()
        if (value === "calender" && formSections.find(({ type }) => type === "calender")) {
          return alert("oneSection") // todo:
        }
        if (value === "time" && formSections.find(({ type }) => type === "time")) {
          return alert("oneSection") // todo:
        }
        addSection({ type: value as SectionListTypes, newId })
        replace(`${pathname}#${newId}`)
        break
      case "imageSelector":
        setActive({ key: "modal", payload: { type: `${value}-image` } })
        setActive({ key: "tooltip", payload: { type: null } })
        break
      case "colorSelector":
        setActive({ key: "submenu", payload: { type: null } })
        setActive({ key: "tooltip", payload: { type: value } })
        break
      case "submenu":
        setActive({ key: "tooltip", payload: { type: null } })
        setActive({ key: "submenu", payload: { type: value } })
        break

      default:
        break
    }
  }

  return (
    <div className={cx("list")}>
      {isOpenAllList ? (
        list.map((list, i) => {
          return (
            <div className={cx("li")} key={`list_${i}`}>
              <button
                onClick={() => onClickList(list.value, list.actionType)}
                className={cx("btn", { active: active.submenu.type === list.value })}
              >
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(list.value)}</span>
              </button>
            </div>
          )
        })
      ) : (
        <Swiper spaceBetween={10} slidesPerView={"auto"} freeMode={true} modules={[FreeMode]} className={cx("slider")}>
          {list.map((list, i) => {
            return (
              <SwiperSlide className={cx("slide")} key={`list_${i}`}>
                <button
                  onClick={() => onClickList(list.value, list.actionType)}
                  className={cx("btn", { active: active.submenu.type === list.value })}
                >
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={list.icon} />
                  </div>
                  <span>{t(list.value)}</span>
                </button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}
