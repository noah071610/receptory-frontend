"use client"
import PageLoading from "@/components/Loading/LoadingPage"
import ConfirmReservation from "@/components/Modal/ConfirmReservation"
import MakePassword from "@/components/Modal/MakeConfirm"
import ModalLoading from "@/components/Modal/ModalLoading"
import SectionLayout from "@/components/Sections/display"
import { _url } from "@/config"
import getSection from "@/containers/page/sectionPageMap"
import style from "@/containers/page/style.module.scss"
import { usePageValidator } from "@/hooks/usePageValidator"
import { useMainStore } from "@/store/main"
import { PageType } from "@/types/Page"
import getConfirmationId from "@/utils/helpers/getConfirmationId"
import { setDateFormat } from "@/utils/helpers/setDate"
import { getAnimation } from "@/utils/styles/getAnimation"
import { faFire } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import i18next from "i18next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
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

const PageHome = ({ initialParams, initialData }: { initialParams?: string; initialData: PageType }) => {
  const { pageId } = usePageValidator({ isPage: true, initialData })
  const pathname = usePathname()
  const { push, replace } = useRouter()
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [components, setComponents] = useState<JSX.Element[]>([])

  const onClickCTA = useCallback(() => {
    setIsLoading(true)
    push(`${pathname}?s=form`)
  }, [pathname, push])

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

  useEffect(() => {
    // confirm으로 바로 넘어갔을때 확인 모달
    if (!isConfirm && initialParams === "confirm") {
      setModal({ section: null, type: "confirmReservation" })
    }
  }, [isConfirm, initialParams, setModal])

  useEffect(() => {
    // 페이지 언어 설정
    if (initialData) {
      setPageLang(initialData.lang)
      i18next.changeLanguage(initialData.lang)
    }
  }, [initialData, setPageLang])

  useEffect(() => {
    if (initialData) {
      setIsLoading(true)

      if (initialParams === "confirm" && !isConfirm) {
        return replace(`${pathname}?s=home`)
      }

      !(async function () {
        const arr = await Promise.all(
          (initialParams === "form"
            ? initialData.content.formSections
            : initialParams === "confirm"
              ? initialData.content.confirmSections
              : initialData.content.homeSections
          ).map(async (v, i) => {
            const AwesomeComponent: any = await getSection(v.type)
            return AwesomeComponent ? (
              <SectionLayout
                style={{ paddingBottom: v.style?.paddingBottom }}
                id={v.id}
                index={i}
                isAnimation={true}
                noPadding={v.type === "thumbnail" || v.type === "slider"}
                key={`${v.id}`}
              >
                <AwesomeComponent
                  section={v}
                  text={v.value}
                  onClickCTA={v.id === "thumbnail" ? onClickCTA : undefined}
                  isDisplayMode={true}
                />
              </SectionLayout>
            ) : (
              <section></section>
            )
          })
        )
        setComponents(arr)
        setTimeout(() => {
          setIsLoading(false)
        })
      })()
    }
  }, [initialData, initialParams, isConfirm, onClickCTA, pathname, replace])

  const userFormLength = useMemo(
    () =>
      initialParams === "form"
        ? initialData
          ? initialData.content.formSections.filter(
              (v: any) => !["text", "title", "callout", "checkList", "thumbnail"].includes(v.type)
            ).length
          : 999999
        : 999999,
    [initialData, initialParams]
  )

  useEffect(() => {
    if (initialParams !== "confirm") {
      clearPage()
    }
  }, [clearPage, initialParams])

  const isReadyToSubmit = useMemo(() => {
    return (
      initialParams === "form" &&
      userFormLength ===
        selected.filter((v) => v).filter((v) => v.value.length && v.value.every(({ text }) => text)).length
    )
  }, [selected, userFormLength, initialParams])

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

  return (
    initialData?.format === "active" &&
    pageLang && (
      <div onClick={onClickPage} className={cx("body")}>
        <main className={cx("main")}>
          {components.map((v: any) => v)}

          {initialParams === "form" && (
            <div
              style={isLoading ? { display: "none" } : getAnimation({ type: "fadeUp", delay: 180 * components.length })}
              className={cx("submit-btn-wrapper")}
            >
              <div className={cx("float-message", { active: isReadyToSubmit })}>
                <p>{isReadyToSubmit ? "클릭해서 제출" : "내용을 전부 입력해주세요!"}</p>
              </div>
              <button
                disabled={!isReadyToSubmit}
                onClick={onClickSubmit}
                className={cx("submit", { inactive: !isReadyToSubmit })}
              >
                <span>{"제출하기"}</span>
              </button>
              <Link href={pathname} className={cx("goback")}>
                <span>메인 페이지로</span>
              </Link>
            </div>
          )}
          {initialParams === "confirm" && isConfirm && (
            <>
              <div
                style={
                  isLoading ? { display: "none" } : getAnimation({ type: "fadeUp", delay: 180 * components.length })
                }
                className={cx("submit-btn-wrapper")}
              >
                <Link href={pathname} className={cx("gohome")}>
                  <span>메인 페이지로</span>
                </Link>
              </div>
            </>
          )}

          {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
          {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
          {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
          {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
          {modal.type === "makePassword" && isSubmit && curConfirmationId && (
            <MakePassword setIsConfirming={setIsConfirming} confirmId={curConfirmationId} setIsConfirm={setIsConfirm} />
          )}
          {modal.type === "confirmReservation" && (
            <ConfirmReservation pageLang={pageLang} setIsConfirm={setIsConfirm} setIsConfirming={setIsConfirming} />
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
