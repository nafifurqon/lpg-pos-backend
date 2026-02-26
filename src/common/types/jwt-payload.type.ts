export type JwtAccessPayload = {
  sub: string    // user.id (UUID)
  email: string
}

export type JwtRefreshPayload = {
  sub: string    // user.id (UUID)
  authId: string // authentication.id (UUID) — used to validate token is still active
}
