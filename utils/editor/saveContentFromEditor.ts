import { save } from "@/actions/save"
import { toastSuccess } from "@/config/toast"
import { Langs } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import hasString from "../helpers/hasString"
import { convertEditorStateToString } from "./textEditor"

export default async function saveContentFromEditor({
  content,
  pageId,
  lang,
  event,
}: {
  content: SaveContentType
  pageId?: string | string[]
  lang: Langs
  event?: any
}) {
  // todo:
  return
  if (typeof pageId !== "string") return

  // 살짝 위험하다.. 하지만 무조건 썸네일은 첫번째에 존재한다. 존재하지 않으면 에러다.
  const thumbnailSection = content.initSections[0]
  const title = thumbnailSection?.list[0]?.value ?? ""
  const description = thumbnailSection?.list[1]?.value ?? ""
  const background = thumbnailSection?.style.background ?? ""
  const image = thumbnailSection?.src
  const isOk = await save({
    pageId,
    title,
    description,
    format: "inactive", // todo:
    lang,
    thumbnail: hasString(background) ? background : image ?? "",
    content: {
      ...content,
      currentUsedImages: [], // todo 일단 제외
      initSections: content.initSections.map((v) => {
        switch (v.type) {
          case "callout":
          case "qna":
          case "text":
            return convertEditorStateToString(v)
          default:
            return v
        }
      }),
      formSections: content.formSections.map((v) => {
        switch (v.type) {
          case "callout":
          case "qna":
          case "text":
            return convertEditorStateToString(v)
          default:
            return v
        }
      }),
    },
  })
  if (isOk) {
    toastSuccess("success")
  }
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
