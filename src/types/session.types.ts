export interface ChangePasswordPayload {
  username: string
  oldPassword: string
  newPassword: string
}

export interface LoginPayload {
  username: string
  password: string
}
