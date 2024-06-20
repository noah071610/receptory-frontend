import { save } from "@/actions/save"
import { thumbnailUrl } from "@/config"
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
  const thumb = content.homeSections[0]
  const pageOpt = content.pageOptions
  const thumbnailEmbedContent: { title: string; description: string; thumbnail: string } = {
    title: thumb.data.title ?? "",
    description: thumb.data.description ?? "",
    thumbnail: pageOpt.isUseReceptoriThumbnail
      ? thumbnailUrl
      : thumb.style?.background
        ? thumb.style?.background
        : thumb.src
          ? thumb.src
          : "",
  }
  const embedContent = {
    title: pageOpt.embed.title,
    description: pageOpt.embed.description,
    thumbnail: pageOpt.isUseReceptoriThumbnail ? thumbnailUrl : pageOpt.embed.src,
  }

  content.homeSections = content.homeSections.slice(0, 20)
  content.formSections = content.formSections.slice(0, 20)
  content.confirmSections = content.confirmSections.slice(0, 20)
  const { currentUsedColors, currentUsedImages, stage, ...rest } = content

  return Object.assign(
    {
      pageId,
      format: pageOpt.format,
      lang,
      thumbnailType: pageOpt.isUseReceptoriThumbnail
        ? "image"
        : pageOpt.isUseHomeThumbnail
          ? thumb.style?.background
            ? "image"
            : hasString(thumb.options.imageStatus)
              ? thumb.options.imageStatus
              : "image"
          : "image",
      customLink: pageOpt.isNotUseCustomLink ? pageId : hasString(pageOpt.customLink) ? pageOpt.customLink : pageId,
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
  if (isOk === "ok") {
    !noMessage && toastSuccess("saved")
    return isOk
  }
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
