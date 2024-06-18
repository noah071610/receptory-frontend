"use client"

import Loading from "@/components/Loading"
import ImageSelector from "@/components/Modal/ImageSelector"
import SectionLayout from "@/components/Sections/index"
import { useEditorStore } from "@/store/editor"
import cs from "classnames/bind"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
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
import { useInitTranslation } from "@/i18n/client"
import { useMainStore } from "@/store/main"
import { EditStage } from "@/types/Edit"
import { Langs } from "@/types/Main"
import { PageFormatType, SaveType } from "@/types/Page"
import { createNewSection } from "@/utils/createNewSection"
import { saveContentFromEditor } from "@/utils/editor/saveContentFromEditor"
import i18n from "i18next"
import dynamic from "next/dynamic"
const cx = cs.bind(style)

function targetT(value: string) {
  return i18n.t(value, {
    ns: ["edit-page"],
  })
}

const getInitialStates = (lang: Langs) => ({
  homeSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "simple", newId: "thumbnail" })],
  formSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "formThumbnail" })],
  confirmSections: [
    createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "rendingThumbnail" }),
    createNewSection({ type: "confirm", index: 1, newId: "confirm" }),
  ],
  stage: "home" as EditStage,
  currentUsedImages: [] as string[],
  currentUsedColors: [] as string[],
  pageOptions: {
    format: "inactive" as PageFormatType,
    lang,
    customLink: "",
    isUseHomeThumbnail: true,
    isNotUseCustomLink: true,
    embed: {
      title: targetT("embedInitialTitle") as string,
      description: "",
      src: "",
    },
  },
})

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
  const { t } = useInitTranslation(lang, ["edit-page", "messages"])
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
    if (typeof window === "object") {
      window.scrollTo({
        top: 0,
      })
    }
  }, [stage])

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
          const initContent = getInitialStates(data.lang)
          await saveContentFromEditor({
            content: initContent,
            pageId,
            lang: data.lang,
            noMessage: true,
          })
          loadSections(initContent)
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
  }, [save, pageId, user, setPageLang, loadSections, back, t])

  const topSections = useMemo(
    () => (stage === "confirm" ? confirmSections.slice(0, 2) : [(stage === "home" ? homeSections : formSections)[0]]),
    [confirmSections, formSections, homeSections, stage]
  )

  return (
    <>
      <Header />
      <PageLayout>
        {isLoading ? (
          <div className={cx("page-loading")}>
            <Loading isFull={true} />
          </div>
        ) : (
          <>
            <div className={cx("main", { isRending: stage === "rending" })}>
              <div className={cx("loading-cover", { success: !isLoading })}>
                {isLoading && <Loading isFull={true} />}
              </div>
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
                isUseEmoji={!!active.modal.type.match(/(callout|thumbnail|select|choices)/g)?.length}
                setIsLoading={setIsModalLoading}
              />
            )}
            {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
            {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
            {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
            {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
            <PageLoading isLoading={isModalLoading} />
          </>
        )}
      </PageLayout>
    </>
  )
}

export default EditPage
