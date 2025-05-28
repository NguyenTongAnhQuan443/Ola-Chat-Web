export interface LoginHistoryItem {
  userId: string
  loginTime: string // ISO 8601 datetime
  logoutTime: string
  status: 'ONLINE' | 'OFFLINE' | 'EXPIRED' | string
  userAgent: string
}

export interface LoginHistoryResponse {
  data: LoginHistoryItem[]
}
