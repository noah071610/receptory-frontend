"use client"
import PageLoading from "@/components/Loading/LoadingPage"
import ConfirmReservation from "@/components/Modal/ConfirmReservation"
import MakePassword from "@/components/Modal/MakeConfirm"
import ModalLoading from "@/components/Modal/ModalLoading"
import { _url } from "@/config"
import style from "@/containers/page/style.module.scss"
import { useInitTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { Langs, PageStage } from "@/types/Main"
import { PageType } from "@/types/Page"
import getConfirmationId from "@/utils/helpers/getConfirmationId"
import { setDateFormat } from "@/utils/helpers/setDate"
import { getAnimation } from "@/utils/styles/getAnimation"
import { faFire } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useLayoutEffect, useMemo, useState } from "react"
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

const PageHome = ({
  lang,
  confirmationId,
  initialParams,
  sections,
  initialData,
}: {
  lang: Langs
  initialParams: PageStage
  confirmationId?: string
  sections: {
    home: JSX.Element[]
    form: JSX.Element[]
    confirm: JSX.Element[]
  }
  initialData: PageType
}) => {
  const { t } = useInitTranslation(lang, ["page", "messages"])
  const { pageId } = useParams()
  const pathname = usePathname()
  const { push } = useRouter()
  const { modal, setModal, selected, setConfirmation, clearPage, pageLang, curConfirmationId, setPageLang } =
    useMainStore([
      "modal",
      "setModal",
      "selected",
      "setConfirmation",
      "clearPage",
      "pageLang",
      "curConfirmationId",
      "setPageLang",
    ])
  const [pageStage, setPageStage] = useState<PageStage>(initialParams)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

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

  useLayoutEffect(() => {
    // confirm으로 바로 넘어갔을때 확인 모달
    if (!isConfirm && confirmationId) {
      setModal({ section: null, type: "confirmReservation" })
    }
  }, [isConfirm, confirmationId, setModal])

  useLayoutEffect(() => {
    clearPage(initialParams)
  }, [clearPage, initialParams])

  const userFormLength = useMemo(
    () =>
      pageStage === "form"
        ? initialData
          ? initialData.content.formSections.filter(
              (v: any) => !["text", "title", "callout", "checkList", "thumbnail"].includes(v.type)
            ).length
          : 999999
        : 999999,
    [initialData, pageStage]
  )

  const isReadyToSubmit = useMemo(() => {
    return (
      pageStage === "form" &&
      userFormLength ===
        selected.filter((v) => v).filter((v) => v.value.length && v.value.every(({ text }) => text)).length
    )
  }, [selected, userFormLength, pageStage])

  const onClickSubmit = async () => {
    if (typeof pageId !== "string") return

    setIsSubmit(true)
    setConfirmation({
      confirmDate: setDateFormat({ date: new Date(), lang: pageLang, isTime: true }),
      curConfirmationId: getConfirmationId(),
    })
    setModal({
      section: null,
      type: "makePassword",
    })
  }

  const onClickStage = (type: PageStage, isConfirmPage?: boolean) => {
    setPageStage(type)
    if (isConfirmPage) {
      if (confirmationId) {
        push(pathname)
      }
    }
  }

  return (
    initialData?.format === "active" &&
    pageLang && (
      <div onClick={onClickPage} className={cx("body")}>
        <main className={cx("main")}>
          {sections[pageStage].map((v: JSX.Element) => {
            if (v.props.children.props.section.id === "thumbnail") {
              v.props.children.props.setPageStage = setPageStage
            }

            return v
          })}

          {pageStage === "form" && (
            <div
              style={getAnimation({ type: "fadeUp", delay: 180 * sections["form"].length })}
              className={cx("submit-btn-wrapper")}
            >
              <div className={cx("float-message", { active: isReadyToSubmit })}>
                <p>{t(isReadyToSubmit ? "readyToSubmit" : "pleaseWriteContent")}</p>
              </div>
              <button
                disabled={!isReadyToSubmit}
                onClick={onClickSubmit}
                className={cx("submit", { inactive: !isReadyToSubmit })}
              >
                <span>{t("submit")}</span>
              </button>
              <button onClick={() => onClickStage("home")} className={cx("goback")}>
                <span>{t("gotoMain")}</span>
              </button>
            </div>
          )}
          {pageStage === "confirm" && isConfirm && (
            <>
              <div
                style={getAnimation({ type: "fadeUp", delay: 180 * sections["confirm"].length })}
                className={cx("submit-btn-wrapper")}
              >
                <button onClick={() => onClickStage("home", true)} className={cx("gohome")}>
                  <span>{t("gotoMain")}</span>
                </button>
              </div>
            </>
          )}

          {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
          {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
          {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
          {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
          {modal.type === "makePassword" && isSubmit && curConfirmationId && (
            <MakePassword
              setIsConfirming={setIsConfirming}
              confirmId={curConfirmationId}
              setPageStage={setPageStage}
              setIsConfirm={setIsConfirm}
            />
          )}
          {modal.type === "confirmReservation" && confirmationId && (
            <ConfirmReservation
              confirmationId={confirmationId}
              pageLang={pageLang}
              setIsConfirm={setIsConfirm}
              setPageStage={setPageStage}
              setIsConfirming={setIsConfirming}
            />
          )}
          <Link className={cx("footer", { active: initialParams !== "form" })} href={_url.client + "/login"}>
            <p>
              <FontAwesomeIcon icon={faFire} /> <span>{"Powered by Receptory"}</span>
            </p>
          </Link>
          <PageLoading isLoading={isConfirming} />
        </main>
      </div>
    )
  )
}

export default PageHome
