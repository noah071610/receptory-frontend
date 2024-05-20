import { save } from "@/actions/save"
import { toastSuccess } from "@/config/toast"
import { Langs } from "@/types/Main"
import { SaveContentType, SaveUpdateType } from "@/types/Page"
import hasString from "../helpers/hasString"

export const convertContent = ({
  content,
  pageId,
  lang,
  isDeploy,
}: {
  content: SaveContentType
  pageId?: string | string[]
  lang: Langs
  isDeploy?: boolean
}) => {
  const thumbnailSection = content.initSections[0]
  const title = thumbnailSection?.data?.title ?? ""
  const description = thumbnailSection?.data?.description ?? ""
  const background = thumbnailSection?.style.background ?? ""
  const image = thumbnailSection?.src
  content.initSections = content.initSections.slice(0, 20)
  content.formSections = content.formSections.slice(0, 20)
  content.rendingSections = content.rendingSections.slice(0, 20)
  const { currentUsedColors, currentUsedImages, stage, ...rest } = content

  return {
    pageId,
    title,
    description,
    format: content.pageOptions.format,
    lang,
    thumbnail: hasString(background) ? background : image ?? "",
    content: isDeploy ? { ...rest } : content,
  } as SaveUpdateType
}

export async function saveContentFromEditor({
  content,
  pageId,
  lang,
  event,
  noMessage,
}: {
  content: SaveContentType
  pageId?: string | string[]
  lang: Langs
  event?: any
  noMessage?: boolean
}) {
  if (typeof pageId !== "string") return

  const data = convertContent({ content, pageId, lang })

  const isOk = await save(data)
  if (isOk) {
    !noMessage && toastSuccess("saved")
    return isOk
  }
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
