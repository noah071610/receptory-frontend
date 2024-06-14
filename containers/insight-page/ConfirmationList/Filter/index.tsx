"use client"

import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import AdjustFilterButton from "./AdjustFilterButton"
import FilterList from "./FilterList"
import SearchBar from "./SearchBar"
import SortList from "./SortList"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Filter = ({ formSections }: { formSections?: SectionType[] }) => {
  return (
    <div className={cx("search")}>
      <SearchBar />
      <SortList formSections={formSections} />
      <FilterList formSections={formSections} />
      <AdjustFilterButton />
    </div>
  )
}

export default Filter
