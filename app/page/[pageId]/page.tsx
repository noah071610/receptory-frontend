import PageHome from "@/containers/page/Home"
import style from "@/containers/page/style.module.scss"
import { PageParams } from "@/types/Main"
import cs from "classNames/bind"
const cx = cs.bind(style)

async function getData(pageId: string) {
  const res = await fetch(`http://localhost:5555/api/page?pageId=${pageId}`, {
    method: "GET",
  })
  return res.json()
}

export default async function PageLayout({ children, params: { pageId } }: Readonly<PageParams>) {
  const initialData = await getData(pageId)

  return (
    <>
      <div className={cx("body")}>
        <main className={cx("main")}>
          <PageHome initialData={initialData} />
        </main>
      </div>
    </>
  )
}
