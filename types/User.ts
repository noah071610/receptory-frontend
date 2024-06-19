export type Providers = "google" | "facebook" | "local"

export interface UserType {
  email: string
  userId: string
  userName: string
  userImage: string
  provider: Providers
  plan: number
  color: string
  createdAt: Date
}
