export type Providers = "google" | "facebook" | "local"

export interface UserType {
  userId: string
  userName: string
  userImage: string
  provider: Providers
  plan: number
  color: string
  createdAt: Date
}
