import { useAppSelector } from "../store/hooks"

export function useAuth() {
  const currentUser = useAppSelector((state) => state.users.currentUser)

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

