import PageHome from "@/containers/page/Home"
import { PageParams } from "@/types/Main"

async function getData(pageId: string) {
  const res = await fetch(`http://localhost:5555/api/page?pageId=${pageId}`, {
    method: "GET",
  })
  return res.json()
}

export default async function PageLayout({ children, params: { pageId }, searchParams: { s } }: Readonly<PageParams>) {
  const initialData = await getData(pageId)

  return <PageHome initialParams={s} initialData={initialData} />
}
