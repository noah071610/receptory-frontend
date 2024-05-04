// @ts-ignore
import { memo } from "react"

import { SectionType } from "@/types/Edit"
import getId from "@/utils/getId"
import classNames from "classNames"
import dynamic from "next/dynamic"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: true,
})

const getHtmlArr = (blocks: any[]): any[] => {
  const arr: any[] = []
  let ulArr: any[] = []
  let olArr: any[] = []

  blocks.forEach((block) => {
    const map: { [key: string]: any } = {
      centerAlign: (
        <p key={block.key} style={{ textAlign: "center" }}>
          {block.text}
        </p>
      ),
      leftAlign: (
        <p key={block.key} style={{ textAlign: "left" }}>
          {block.text}
        </p>
      ),
      rightAlign: (
        <p key={block.key} style={{ textAlign: "right" }}>
          {block.text}
        </p>
      ),
      blockQuote: (
        <blockquote className={style.superFancyBlockquote} key={block.key}>
          {block.text}
        </blockquote>
      ),
      "header-one": <h1 key={block.key}>{block.text}</h1>,
      "header-two": <h2 key={block.key}>{block.text}</h2>,
      "header-three": <h3 key={block.key}>{block.text}</h3>,
    }
    if (block.type === "unordered-list-item" || block.type === "ordered-list-item") {
      return (block.type === "unordered-list-item" ? ulArr : olArr).push({ text: block.text, id: block.key })
    }
    if (ulArr.length > 0) {
      arr.push(
        <ul key={getId()}>
          {ulArr.map(({ text, id }) => (
            <li key={id}>{text}</li>
          ))}
        </ul>
      )
      ulArr = []
    }
    if (olArr.length > 0) {
      arr.push(
        <ol key={getId()}>
          {olArr.map(({ text, id }) => (
            <li key={id}>{text}</li>
          ))}
        </ol>
      )
      olArr = []
    }
    arr.push(map[block.type as string] ?? <p key={block.key ?? getId()}>{block.text}</p>)
  })

  if (ulArr.length > 0) {
    arr.push(
      <ul key={getId()}>
        {ulArr.map(({ text, id }) => (
          <li key={id}>{text}</li>
        ))}
      </ul>
    )
    ulArr = []
  }
  if (olArr.length > 0) {
    arr.push(
      <ol key={getId()}>
        {olArr.map(({ text, id }) => (
          <li key={id}>{text}</li>
        ))}
      </ol>
    )
    olArr = []
  }

  return arr
}

const Text = ({
  section,
  textColor,
  listIndex,
  isDisplayMode,
}: {
  section: SectionType
  textColor?: string
  listIndex?: number
  isDisplayMode?: boolean
}) => {
  return (
    <div className={cx(style.layout)}>
      <TextEditor section={section} isDisplayMode={isDisplayMode} listIndex={listIndex} textColor={textColor} />
    </div>
  )
}

export default memo(Text)
