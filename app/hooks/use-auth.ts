import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session } = useSession()
  const currentUser = session?.user

  const isAdmin = currentUser?.role === "admin"

  const can = (action: string) => {
    switch (action) {
      case "manage_users":
        return isAdmin
      case "export_data":
        return isAdmin
      default:
        return true
    }
  }

  return { currentUser, isAdmin, can }
}
