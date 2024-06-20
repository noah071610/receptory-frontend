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
            width: `450px`,
            height: "250px",
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
            alt="receptori-thumbnail-icon"
          />
        </div>
      ),
      {
        width: 450,
        height: 250,
      }
    )
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
