"use client"

import Loading from "@/components/Loading"
import ImageSelector from "@/components/Modal/ImageSelector"
import SectionLayout from "@/components/Sections/index"
import { initialStates, useEditorStore } from "@/store/editor"
import cs from "classnames/bind"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import style from "./style.module.scss"

import { getSave } from "@/actions/save"
import PageLoading from "@/components/Loading/LoadingPage"
import ModalLoading from "@/components/Modal/ModalLoading"
import EditorFooter from "@/containers/edit-page/EditorFooter"
import Header from "@/containers/edit-page/Header"
import PageLayout from "@/containers/edit-page/PageLayout"
import Preview from "@/containers/edit-page/Preview"
import Rending from "@/containers/edit-page/Rending"
import SectionList from "@/containers/edit-page/SectionList"
import { sectionMap } from "@/containers/edit-page/sectionMap"
import { usePageValidator } from "@/hooks/usePageValidator"
import i18next from "@/i18n/init"
import { useMainStore } from "@/store/main"
import { Langs } from "@/types/Main"
import { SaveType } from "@/types/Page"
import { saveContentFromEditor } from "@/utils/editor/saveContentFromEditor"
import dynamic from "next/dynamic"
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

const EditPage = ({ lang }: { lang: Langs }) => {
  const { pageId, user } = usePageValidator({ isAuth: true, isEdit: true })
  const { t } = useTranslation(["messages"], {
    lng: lang,
  })
  const pathname = usePathname()
  const { back } = useRouter()

  const [save, setSave] = useState<null | SaveType>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isModalLoading, setIsModalLoading] = useState(false)

  const { modal, setPageLang } = useMainStore(["modal", "setPageLang"])
  const { homeSections, stage, formSections, active, loadSections, confirmSections } = useEditorStore([
    "homeSections",
    "stage",
    "formSections",
    "active",
    "loadSections",
    "confirmSections",
  ])

  useEffect(() => {
    if (!save && pageId && user) {
      !(async function () {
        const data = await getSave(pageId)
        if (data === "notFound" || !data) {
          alert(
            t("error.noFound", {
              ns: "messages",
            })
          )
          return back()
        }

        setPageLang(data.lang)

        if (!data.content?.homeSections || data.content?.homeSections?.length <= 0) {
          await saveContentFromEditor({
            content: initialStates,
            pageId,
            lang: data.lang,
            noMessage: true,
          })
          return setIsLoading(false)
        }

        // 아니면 로드 어짜피 store에서도 reducer들이 걸러줌
        loadSections(data.content)
        setSave(data)

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      })()
    }
  }, [save, pageId, user, setPageLang, loadSections, back])

  const topSections = useMemo(
    () => (stage === "confirm" ? confirmSections.slice(0, 2) : [(stage === "home" ? homeSections : formSections)[0]]),
    [confirmSections, formSections, homeSections, stage]
  )

  // page의 lang이 아니라 브라우저 언어로 보여주기
  useLayoutEffect(() => {
    if (i18next) {
      i18next.changeLanguage(lang)
    }
    setPageLang(lang)
  }, [lang, setPageLang])

  return (
    <>
      <Header />
      <PageLayout>
        <div className={cx("main", { isRending: stage === "rending" })}>
          <div className={cx("loading-cover", { success: !isLoading })}>{isLoading && <Loading isFull={true} />}</div>
          <div className={cx("editor")}>
            {stage !== "rending" &&
              topSections?.map((v, i) => (
                <SectionLayout key={`top-${stage}-${i}`} pathname={pathname} isTopSection={true} section={v}>
                  {sectionMap[v.type](v)}
                </SectionLayout>
              ))}

            {stage === "home" && <SectionList sections={homeSections} stage={stage} />}
            {stage === "form" && <SectionList sections={formSections} stage={stage} />}
            {stage === "confirm" && <SectionList sections={confirmSections} stage={stage} />}
            {stage === "rending" && <Rending isLoading={isModalLoading} setIsLoading={setIsModalLoading} />}

            {stage !== "rending" && <EditorFooter lang={lang} />}
          </div>
          {stage !== "rending" && <Preview />}
        </div>

        {active.modal.type?.includes("image") && (
          <ImageSelector
            lang={lang}
            IsUseEmoji={!!active.modal.type.match(/(callout|thumbnail)/g)?.length}
            setIsLoading={setIsModalLoading}
          />
        )}
        {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
        {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
        {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
        {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
        <PageLoading isLoading={isModalLoading} />
      </PageLayout>
    </>
  )
}

export default EditPage
