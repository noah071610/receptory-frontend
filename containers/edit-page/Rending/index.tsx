"use client"

import { deploy, inactivePage } from "@/actions/page"
import { checkCustomLink } from "@/actions/save"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Rending({
  setIsLoading,
  isLoading,
}: {
  setIsLoading: (b: boolean) => void
  isLoading: boolean
}) {
  const queryClient = useQueryClient()
  const { pageId } = useParams()

  const { t } = useTranslation(["edit-page"])
  const {
    stage,
    homeSections,
    formSections,
    currentUsedImages,
    currentUsedColors,
    confirmSections,
    pageOptions,
    setPageOptions,
    setActive,
    setRevert,
    setPageEmbedOption,
  } = useEditorStore([
    "stage",
    "homeSections",
    "formSections",
    "currentUsedImages",
    "currentUsedColors",
    "confirmSections",
    "pageOptions",
    "setPageOptions",
    "setActive",
    "setRevert",
    "setPageEmbedOption",
  ])
  const { format, customLink, embed, isUseHomeThumbnail, isNotUseCustomLink } = pageOptions
  const isActive = format === "active"
  const thumbnailEmbedContent: { title: string; description: string; src: string } = {
    title: homeSections[0].data.title ?? "",
    description: homeSections[0].data.description ?? "",
    src: homeSections[0].style?.background ?? homeSections[0]?.src ?? "",
  }

  const onChangeFormat = async (value: "inactive" | "active" | "save") => {
    if (isLoading) return
    setIsLoading(true)
    if (typeof pageId !== "string") return setIsLoading(false)
    if (formSections.length <= 1) {
      // 폼에 적어도 한개 이상의 섹션이 필요합니다
      toastError("mustHaveFormSection")
      return setIsLoading(false)
    }
    if (!isNotUseCustomLink) {
      if (customLink.trim().length !== customLink.length) {
        setIsLoading(false)
        // 링크에 공백은 포함 될 수 없습니다.
        return toastError("noEmptyCustomLink")
      }
      if (customLink.length > 0) {
        const temp = customLink.match(/[^A-Za-z0-9\-\_]/g)
        if (temp) {
          setIsLoading(false)
          // 링크에 영문자가 아닌 문자 또는 특수문자, 공백은 포함 될 수 없습니다.
          return toastError("invalidCustomLink")
        }
        const msg = await checkCustomLink(customLink)
        if (msg === "no") {
          setIsLoading(false)
          // 다른 사람이 사용 중인 커스텀 링크에요
          toastError("alreadyUsedCustomLink")
          return
        }
      }
    }

    const payload = {
      content: {
        stage,
        homeSections,
        formSections,
        confirmSections,
        currentUsedImages,
        currentUsedColors,
        pageOptions: {
          ...pageOptions,
          format: "active",
        },
      },
      pageId,
      lang: pageOptions.lang as Langs,
    } as { content: SaveContentType; pageId: string; lang: Langs }

    let status = "no"
    if (value === "active" || value === "save") {
      status = await deploy(payload) // action에서 자동으로 backend용 input 타입으로 변환 해줌.
    }
    if (value === "inactive") {
      payload.content.pageOptions.format = "inactive"
      status = await inactivePage({ pageId })
    }

    if (status === "ok") {
      setTimeout(() => {
        toastSuccess(value === "save" ? "deploy" : value === "active" ? "deploy" : "inactive")
        setPageOptions({ type: "format", payload: payload.content.pageOptions.format })
        setRevert("clear")
        setIsLoading(false)
      }, 1000)

      await queryClient.invalidateQueries({ queryKey: queryKey.page(pageId as string) })
      await queryClient.refetchQueries({ queryKey: queryKey.save.list })
    }
  }

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "embed-image" } })
  }

  const onChangeInput = (inputValue: string, type: "title" | "description" | "customLink") => {
    if (type === "customLink") {
      setPageOptions({ type: "customLink", payload: inputValue })
    } else {
      setPageEmbedOption({ type, payload: inputValue })
    }
  }

  const onClickSlider = (type: "embed" | "customLink") => {
    switch (type) {
      case "embed":
        setPageOptions({ type: "isUseHomeThumbnail", payload: !isUseHomeThumbnail })
        break
      case "customLink":
        setPageOptions({ type: "isNotUseCustomLink", payload: !isNotUseCustomLink })
        break
    }
  }

  const embedContent = isUseHomeThumbnail ? thumbnailEmbedContent : embed

  return (
    <div className={cx("layout")}>
      <section>
        <div className={cx("title")}>
          <h1>
            <span>{t("shareSettingTitle")}</span>
          </h1>
          <p>{t("shareSettingDescription")}</p>
        </div>
        <div className={cx("section-content", "embed")}>
          <div className={cx("section-content-main")}>
            <button
              onClick={() => onClickSlider("embed")}
              className={cx("bar-layout", { active: !!isUseHomeThumbnail })}
            >
              <div className={cx("content")}>
                <div className={cx("bar")}>
                  <div className={cx("circle")}></div>
                </div>
              </div>
              <span>{t("useHomeThumbnail")}</span>
            </button>
            <h4>{t("footer.thumbnail")}</h4>
            <div
              style={{ background: getImageUrl({ url: embedContent.src ?? "" }) }}
              className={cx("embed-thumbnail", { disabled: isUseHomeThumbnail })}
            >
              {hasString(embedContent.src) && !isUseHomeThumbnail && <DeleteBtn srcKey={"embed"} />}
              <button
                data-closer="rending"
                className={cx("drop-zone", { hidden: !!embedContent.src })}
                onClick={onClickThumbnailUpload}
                disabled={isUseHomeThumbnail}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <h4>{t("footer.title")}</h4>
            <Input
              type="input"
              className={cx("embed-title-input")}
              inputType="titleInput"
              isOptional={false}
              onChange={(inputValue: string) => {
                onChangeInput(inputValue, "title")
              }}
              disabled={isUseHomeThumbnail}
              value={embedContent.title}
            />
            <h4>{t("footer.description")}</h4>
            <Input
              type="input"
              className={cx("embed-description-input")}
              inputType="descriptionInput"
              isOptional={true}
              onChange={(inputValue: string) => {
                onChangeInput(inputValue, "description")
              }}
              disabled={isUseHomeThumbnail}
              value={embedContent.description}
            />
          </div>
        </div>
      </section>
      <section>
        <div className={cx("title")}>
          <h1>
            <span>{t("linkSetting")}</span>
          </h1>
          <p>{t("linkSettingDescription")}</p>
        </div>
        <div className={cx("section-content", "customLink")}>
          <div className={cx("section-content-main")}>
            <button
              onClick={() => onClickSlider("customLink")}
              className={cx("bar-layout", { active: !!isNotUseCustomLink })}
            >
              <div className={cx("content")}>
                <div className={cx("bar")}>
                  <div className={cx("circle")}></div>
                </div>
              </div>
              <span>{t("isNotUseCustomLink")}</span>
            </button>
            {!isNotUseCustomLink && (
              <>
                <h4>{t("customLink")}</h4>
                <Input
                  type="input"
                  inputType="textInput"
                  isOptional={false}
                  onChange={(inputValue: string) => {
                    onChangeInput(inputValue, "customLink")
                  }}
                  value={customLink}
                />
                <p className={cx("link-description")}>
                  <span>{"* "}</span>
                  {t("customLinkInput")}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
      <div className={cx("deploy-wrapper")}>
        <div className={cx("float-message", { active: isActive })}>
          <p>{t(isActive ? "deployingNow" : "undeployNow")}</p>
        </div>
        <button onClick={() => onChangeFormat(isActive ? "save" : "active")} className={cx("deploy")}>
          <span>{t(isActive ? "saveAndDeploy" : "deploy")}</span>
        </button>
      </div>
      {isActive && (
        <button onClick={() => onChangeFormat("inactive")} className={cx("undeploy")}>
          <span>{t("stopDeploy")}</span>
        </button>
      )}
    </div>
  )
}
