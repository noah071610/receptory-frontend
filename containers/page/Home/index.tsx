"use client"
import ModalLoading from "@/components/Modal/ModalLoading"
import SectionLayout from "@/components/Sections/display"
import getSection from "@/containers/page/sectionPageMap"
import style from "@/containers/page/style.module.scss"
import { useMainStore } from "@/store/main"
import { PageType } from "@/types/Page"
import cs from "classNames/bind"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
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

const PageHome = ({ isForm, initialData }: { isForm?: boolean; initialData: PageType }) => {
  const { pageId } = useParams()
  const search = useSearchParams()
  const stage = search.get("s")
  const pathname = usePathname()
  const { back, replace } = useRouter()
  const { modal, setModal, userPick } = useMainStore()
  const [isLoading, setIsLoading] = useState(false)
  const [components, setComponents] = useState<any>(null)

  const onClickCTA = () => {
    replace(`${pathname}?s=form`)
  }

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
    if (typeof pageId !== "string") {
      alert("잘못된 접근입니다.")
      return back()
    }
    if (!initialData) {
      alert("페이지를 로드하지 못했습니다.")
      return back()
    }
  }, [pageId, initialData])

  useEffect(() => {
    if (initialData) {
      !(async function () {
        const arr = await Promise.all(
          (stage === "form" ? initialData.content.formSections : initialData.content.homeSections).map(async (v, i) => {
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
      })()
    }
  }, [stage])

  const userFormLength = useMemo(
    () =>
      stage === "form"
        ? initialData
          ? initialData.content.formSections.filter(
              (v: any) => !["text", "title", "callout", "checkList", "thumbnail"].includes(v.type)
            ).length
          : 999999
        : 999999,
    [stage]
  )
  const isReadyToSubmit = useMemo(() => {
    return (
      stage === "form" &&
      Object.values(userPick).filter((v) => v?.title && v?.value?.length > 0).length === userFormLength
    )
  }, [userPick, userFormLength, stage])

  const onClickSubmit = () => {
    alert("끝이 보여")
  }

  return (
    <div onClick={onClickPage} className={cx("body")}>
      <main className={cx("main")}>
        {components && components.map((v: any) => v)}

        {stage === "form" && (
          <div className={cx("submit-btn-wrapper")}>
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

        {modal.type === "time" && modal.section && <TimePicker section={modal.section} />}
        {modal.type === "date" && modal.section && <DatePicker section={modal.section} />}
        {modal.type === "dateSelect" && modal.section && <DateSelector section={modal.section} />}
        {modal.type === "select" && modal.section && <SelectList section={modal.section} />}
      </main>
    </div>
  )
}

export default PageHome
