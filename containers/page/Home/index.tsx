"use client"
import { getPage } from "@/actions/page"
import SectionLayout from "@/components/Sections/display"
import { queryKey } from "@/config"
import getSection from "@/containers/page/sectionPageMap"
import { PageType } from "@/types/Page"
import { useQuery } from "@tanstack/react-query"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
// import style from "@/containers/edit-page/style.module.scss"
// import cs from "classNames/bind"

// const cx = cs.bind(style)

const PageHome = ({ initialData }: { initialData: PageType }) => {
  const { lang, pageId } = useParams()
  const search = useSearchParams()
  const pathname = usePathname()
  const { back, replace } = useRouter()
  const { data, isError } = useQuery<PageType>({
    queryKey: queryKey.page(pageId as string),
    queryFn: () => getPage({ pageId: pageId as string }),
    enabled: typeof pageId === "string",
    initialData,
  })
  const [components, setComponents] = useState<any>(null)

  useEffect(() => {
    if (typeof pageId !== "string") {
      alert("잘못된 접근입니다.")
      return back()
    }
    if (isError) {
      return back()
    }
  }, [pageId, isError])

  useEffect(() => {
    if (data) {
      !(async function () {
        const content = data.content.homeSections
        const arr = await Promise.all(
          content.map(async (v) => {
            const Target: any = await getSection(v.type)
            return Target ? (
              <SectionLayout
                style={{ paddingBottom: v.style?.paddingBottom }}
                id={v.id}
                noPadding={v.type === "thumbnail" || v.type === "slider"}
                key={`${v.id}`}
              >
                <Target section={v} text={v.value} isDisplayMode={true} />
              </SectionLayout>
            ) : (
              <section></section>
            )
          })
        )
        setComponents(arr)
      })()
    }
  }, [data])

  return data && components && <>{components.map((v: any) => v)}</>
}

export default PageHome
