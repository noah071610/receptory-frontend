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
  const thumbnailSection = content.homeSections[0]
  const thumbnailEmbedContent: { title: string; description: string; thumbnail: string } = {
    title: thumbnailSection.data.title ?? "",
    description: thumbnailSection.data.description ?? "",
    thumbnail: thumbnailSection.style?.background ?? "",
  }
  const embedContent = {
    title: content.pageOptions.embed.title,
    description: content.pageOptions.embed.description,
    thumbnail: content.pageOptions.embed.src,
  }

  content.homeSections = content.homeSections.slice(0, 20)
  content.formSections = content.formSections.slice(0, 20)
  content.confirmSections = content.confirmSections.slice(0, 20)
  const { currentUsedColors, currentUsedImages, stage, ...rest } = content

  return Object.assign(
    {
      pageId,
      format: content.pageOptions.format,
      lang,
      customLink: content.pageOptions.isNotUseCustomLink
        ? pageId
        : hasString(content.pageOptions.customLink)
          ? content.pageOptions.customLink
          : pageId,
      content: isDeploy ? { ...rest } : content,
    },
    content.pageOptions.isUseHomeThumbnail ? thumbnailEmbedContent : embedContent
  ) as SaveUpdateType
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
