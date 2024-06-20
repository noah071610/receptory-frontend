import { API } from "@/config"

export async function uploadImages(formData: FormData): Promise<string[] | undefined> {
  if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
    // 완벽. 가져와
    // const response = await axios.post(`/upload/images`, formData, {
    //   withCredentials: true,
    //   baseURL: _url.server,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    return [""]
  }
}
