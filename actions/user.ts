import { API } from "@/config"
import { UserType } from "@/types/User"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getUser() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.get(`/auth`)

      return response.data
    } else {
      // 잉? 리프레쉬 해줘야겠네
      const user = await refreshUser()
      return user
    }
  } else {
    // 아예 초기 유저인듯
    return null
  }
}

export async function registerUser(data: { email: string; password: string; userName: string }) {
  const response = await API.post(`/auth`, { ...data, provider: "local" })

  return response.data
}

export async function refreshUser(): Promise<UserType | null> {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/auth/refresh`)

    API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

    return response.data.user
  } else {
    return null
  }
}

export async function login(user: { email: string; password: string }) {
  return await API.post(`/auth/login`, { ...user, provider: "local" })
    .then((res) => {
      API.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken

      return res.data
    })
    .catch((error) => {
      return error
    })
}

export async function deleteUser(feedback: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.delete(`/auth?feedback=${feedback}`)

      return response.data
    }
  }
}

export async function logout() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.post(`/auth/logout`)

      return response.data
    }
  }
}
