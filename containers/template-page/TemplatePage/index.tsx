"use client"
import { getUser } from "@/actions/user"
import { selectTemplate } from "@/actions/website"
import ModalLoading from "@/components/Modal/ModalLoading"
import { queryKey } from "@/config"
import { toastSuccess } from "@/config/toast"
import { useInitTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { Langs, PageStage } from "@/types/Main"
import { TemplatePage } from "@/types/Template"
import { UserType } from "@/types/User"
import { faHome, faPenToSquare, faStamp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useLayoutEffect, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const DatePicker = dynamic(() => import("@/components/Modal/DatePicker"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const TimePicker = dynamic(() => import("@/components/Modal/TimePicker"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const DateSelector = dynamic(() => import("@/components/Modal/DateSelector"), {
  ssr: true,
  loading: () => <ModalLoading />,
})
const SelectList = dynamic(() => import("@/components/Modal/SelectList"), {
  ssr: true,
  loading: () => <ModalLoading />,
})

const TemplatePageHome = ({
  initialParams,
  sections,
  initialData,
  lang,
}: {
  initialParams: PageStage
  sections: {
    home: JSX.Element[]
    form: JSX.Element[]
    confirm: JSX.Element[]
  }
  initialData: TemplatePage
  lang: Langs
}) => {
  const queryClient = useQueryClient()
  const { data: user } = useQuery<UserType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const { push } = useRouter()
  const { t } = useInitTranslation(lang, ["page", "messages"])

  const { modal, setModal, clearPage, pageLang } = useMainStore(["modal", "setModal", "clearPage", "pageLang"])
  const [pageStage, setPageStage] = useState<PageStage>(initialParams)

  const onClickPage = (e: any) => {
    const closestElement = e.target.closest("[data-global-closer]")

    if (closestElement) {
      const dataType = closestElement.getAttribute("data-global-closer")

      if (dataType !== "modal") {
        if (modal.type) {
          setModal({ section: null, type: null }) // main store (유저용)
        }
      }
    } else {
      if (modal.type) {
        setModal({ section: null, type: null }) // main store (유저용)
      }
    }
  }

  const onClickSocialLogin = () => {
    if (typeof window === "object") {
      toastSuccess("needToLogin")
      push(`/login?templateId=${initialData.pageId}`)
    }
  }
  const onClickUseTemplate = async () => {
    if (user) {
      const newSave = await selectTemplate(initialData.pageId)
      if (newSave) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        push(`/edit/${user.userId}/${newSave.pageId}`)
      }
    }
  }

  const onClickStage = (type: PageStage) => {
    setPageStage(type)
  }

  useLayoutEffect(() => {
    clearPage(initialParams)
  }, [clearPage, initialParams])

  return (
    pageLang && (
      <div onClick={onClickPage} className={cx("body")}>
        <main className={cx("main")}>
          {sections[pageStage].map((v: JSX.Element) => {
            if (v.props.children.props.section.id === "thumbnail") {
              v.props.children.props.setPageStage = setPageStage
            }

            return v
          })}

          {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
          {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
          {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
          {modal.type === "select" && modal.section && <SelectList section={modal.section} />}

          <div className={cx("template-footer")}>
            <div className={cx("top")}>
              <button onClick={user ? onClickUseTemplate : onClickSocialLogin}>
                <span>템플릿 사용하기</span>
              </button>
            </div>

            <div className={cx("bottom")}>
              <button
                className={cx({ active: !pageStage || pageStage === "home" })}
                onClick={() => onClickStage("home")}
              >
                <FontAwesomeIcon icon={faHome} />
                <span>{t("home")}</span>
              </button>
              <button className={cx({ active: pageStage === "form" })} onClick={() => onClickStage("form")}>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>{t("form")}</span>
              </button>
              <button className={cx({ active: pageStage === "confirm" })} onClick={() => onClickStage("confirm")}>
                <FontAwesomeIcon icon={faStamp} />
                <span>{t("confirm")}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  )
}

export default TemplatePageHome
