'use client'
import { SessionProvider } from "next-auth/react"
import { AuthUserProvider } from "./UserContext"

export default function AuthProvider({
  children,
}: { children: React.ReactNode }) {
  return (
    <SessionProvider >
      <AuthUserProvider>
        {children}
      </AuthUserProvider>
    </SessionProvider>
  )
}