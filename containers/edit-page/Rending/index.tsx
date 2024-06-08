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
import cs from "classNames/bind"
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
  const { t } = useTranslation()
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
  } = useEditorStore()
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
      toastError("폼에 적어도 한개 이상의 섹션이 필요합니다")
      return setIsLoading(false)
    }
    if (!isNotUseCustomLink) {
      if (customLink.trim().length !== customLink.length) {
        setIsLoading(false)
        return toastError("링크에 공백은 포함 될 수 없습니다.")
      }
      if (customLink.length > 0) {
        const temp = customLink.match(/[^A-Za-z0-9\-\_]/g)
        if (temp) {
          setIsLoading(false)
          return toastError("링크에 영문자가 아닌 문자 또는 특수문자, 공백은 포함 될 수 없습니다.")
        }
        const msg = await checkCustomLink(customLink)
        if (msg === "no") {
          setIsLoading(false)
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
        toastSuccess(
          value === "save" ? "저장 후 적용했어요!" : value === "active" ? "포스팅 성공!" : "페이지를 비활성화 했어요."
        )
        setPageOptions({ type: "format", payload: payload.content.pageOptions.format })
        setRevert("clear")
        setIsLoading(false)
      }, 1000)

      // todo: refetchQueries를 써야할까 이건 된다.
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
            <span>임베드 설정</span>
          </h1>
          <p>링크 공유시 나오는 썸네일과 설명 등을 설정 할 수 있어요.</p>
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
            <h4>썸네일</h4>
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
            <h4>제목</h4>
            <Input
              type="input"
              className={cx("embed-title-input")}
              inputType="embed-title"
              isOptional={false}
              onChange={(inputValue: string) => {
                onChangeInput(inputValue, "title")
              }}
              disabled={isUseHomeThumbnail}
              value={embedContent.title}
            />
            <h4>설명</h4>
            <Input
              type="input"
              className={cx("embed-description-input")}
              inputType="embed-description"
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
            <span>커스텀 링크 설정</span>
          </h1>
          <p>공유되는 url에 문자열을 바꿀 수 있어요.</p>
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
                <h4>커스텀 링크</h4>
                <Input
                  type="input"
                  inputType="customLink"
                  isOptional={true}
                  onChange={(inputValue: string) => {
                    onChangeInput(inputValue, "customLink")
                  }}
                  value={customLink}
                />
              </>
            )}
          </div>
        </div>
      </section>
      <div className={cx("deploy-wrapper")}>
        <div className={cx("float-message", { active: isActive })}>
          <p>{isActive ? "현재 배포중이에요!" : "거의 다 왔어요!"}</p>
        </div>
        <button onClick={() => onChangeFormat(isActive ? "save" : "active")} className={cx("deploy")}>
          <span>{isActive ? "저장하고 적용하기" : "배포하기"}</span>
        </button>
      </div>
      {isActive && (
        <button onClick={() => onChangeFormat("inactive")} className={cx("undeploy")}>
          <span>배포중지</span>
        </button>
      )}
    </div>
  )
}
