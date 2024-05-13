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
  const title = thumbnailSection?.list[0]?.value ?? ""
  const description = thumbnailSection?.list[1]?.value ?? ""
  const background = thumbnailSection?.style.background ?? ""
  const image = thumbnailSection?.src
  const { currentUsedColors, currentUsedImages, stage, ...rest } = content
  return {
    pageId,
    title,
    description,
    format: content.pageOptions.format, // todo:
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
}: {
  content: SaveContentType
  pageId?: string | string[]
  lang: Langs
  event?: any
}) {
  if (typeof pageId !== "string") return

  const data = convertContent({ content, pageId, lang })

  const isOk = await save(data)
  if (isOk) {
    toastSuccess("saved")
  }
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
