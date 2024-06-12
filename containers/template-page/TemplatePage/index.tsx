"use client"
import ModalLoading from "@/components/Modal/ModalLoading"
import SectionLayout from "@/components/Sections/display"
import { _url } from "@/config"
import getSection from "@/containers/page/sectionPageMap"
import style from "@/containers/page/style.module.scss"
import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import { TemplatePage } from "@/types/Template"
import { getAnimation } from "@/utils/styles/getAnimation"
import { faFire } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import i18next from "i18next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
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
}: {
  initialParams?: string
  sections: SectionType[]
  initialData: TemplatePage
}) => {
  const { t } = useTranslation(["page", "messages"])
  const pathname = usePathname()
  const { push, replace } = useRouter()
  const { modal, setModal, selected, clearPage, pageLang, setPageLang } = useMainStore([
    "modal",
    "setModal",
    "selected",
    "clearPage",
    "pageLang",
    "setPageLang",
  ])
  const [isLoading, setIsLoading] = useState(true)
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

  useLayoutEffect(() => {
    // 페이지 언어 설정
    if (initialData) {
      setPageLang(initialData.lang)
      i18next.changeLanguage(initialData.lang)
    }
  }, [initialData, setPageLang])

  useEffect(() => {
    if (sections?.length > 0) {
      setIsLoading(true)

      !(async function () {
        const arr = await Promise.all(
          sections.map(async (v, i) => {
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
  }, [sections, initialParams, onClickCTA, pathname, replace])

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
    return push(`${pathname}?s=confirm`)
  }

  return (
    initialData?.isSecret === 0 &&
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
                {/* // todo:  */}
                <p>{t(isReadyToSubmit ? "readyToSubmit" : "pleaseWriteContent")}</p>
              </div>
              <button
                disabled={!isReadyToSubmit}
                onClick={onClickSubmit}
                className={cx("submit", { inactive: !isReadyToSubmit })}
              >
                <span>{t("submit")}</span>
              </button>
              <Link href={pathname} className={cx("goback")}>
                <span>{t("gotoMain")}</span>
              </Link>
            </div>
          )}
          {initialParams === "confirm" && (
            <>
              <div
                style={
                  isLoading ? { display: "none" } : getAnimation({ type: "fadeUp", delay: 180 * components.length })
                }
                className={cx("submit-btn-wrapper")}
              >
                <Link href={pathname} className={cx("gohome")}>
                  <span>{t("gotoMain")}</span>
                </Link>
              </div>
            </>
          )}

          {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
          {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
          {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
          {modal.type === "select" && modal.section && <SelectList section={modal.section} />}

          <Link className={cx("footer", { active: initialParams !== "form" })} href={_url.client + "/login"}>
            <p>
              <FontAwesomeIcon icon={faFire} /> <span>{"Powered by Receptory"}</span>
            </p>
          </Link>
        </main>
      </div>
    )
  )
}

export default TemplatePageHome
