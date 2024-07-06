import { API, checkToken } from "@/config"
import { UserType } from "@/types/User"

export async function getUser() {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.get(`/auth`)

    return response.data
  } else {
    // 잉? 리프레쉬 해줘야겠네
    const user = await refreshUser()
    return user
  }
}

export async function profileChange(data: { userName: string; color: string }) {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.post(`/auth/profile`, data)

    return response.data
  } else {
    // 잉? 리프레쉬 해줘야겠네
    const user = await refreshUser()
    return user
  }
}

export async function registerUser(data: { email: string; password: string; userName: string }) {
  const response = await API.post(`/auth`, { ...data, provider: "local" })

  return response.data
}

export async function refreshUser(): Promise<UserType | null> {
  const response = await API.get(`/auth/refresh`)

  API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

  return response.data.user
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
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.delete(`/auth?feedback=${feedback}`)

    return response.data
  }
}

export async function logout() {
  if (checkToken()) {
    // 완벽. 가져와
    const response = await API.post(`/auth/logout`)

    return response.data
  }
}
