"use client"

import { queryKey } from "@/config"
import { useInsightStore } from "@/store/insight"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const SearchBar = () => {
  const { pageId } = useParams()
  const queryClient = useQueryClient()

  const { t } = useTranslation(["insight-page"])
  const { searchInput, setSearchInput } = useInsightStore(["searchInput", "setSearchInput"])
  const inputRef = useRef<HTMLInputElement>(null)

  const onChangeInput = (str: string) => {
    setSearchInput(str)
  }
  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }

  const refetch = () => {
    typeof pageId === "string" &&
      queryClient.invalidateQueries({
        queryKey: queryKey.insightSearch(pageId),
      })
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      refetch()
    }
  }

  return (
    <div className={cx("input")}>
      <div className={cx("content", { active: searchInput.trim().length > 0 })}>
        <input
          placeholder={t("searchConfirmation")}
          ref={inputRef}
          type="text"
          value={searchInput}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={searchInput.trim().length > 0 ? refetch : onFocus} className={cx("icon-wrapper")}>
          <div className={cx("icon")}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </button>
      </div>
    </div>
  )
}

export default SearchBar
