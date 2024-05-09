export type Providers = "google" | "facebook" | "local"

export interface UserType {
  userId: number
  userName: string
  userImage: string
  provider: Providers
  plan: number
  createdAt: Date
}
