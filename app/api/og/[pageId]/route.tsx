import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const pageId = url.searchParams.get("pageId")

    return new ImageResponse(
      (
        <div
          style={{
            height: "608px",
            width: `1080px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={pageId ? decodeURIComponent(pageId) : ""}
            style={{
              height: "60px",
              width: `60px`,
            }}
          />
        </div>
      ),
      {
        width: 1080,
        height: 608,
      }
    )
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
