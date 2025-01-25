"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchUsers, addUser } from "../store/usersSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import type { User, UserRole } from "../lib/api"
import { useAuth } from "../hooks/use-auth"

export function UserManagement() {
  const { can } = useAuth()

  if (!can("manage_users")) {
    return <div>You do not have permission to manage users.</div>
  }

  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const status = useAppSelector((state) => state.users.status)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" as UserRole })
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers())
    }
  }, [status, dispatch])

  const handleAddUser = async () => {
    try {
      await dispatch(addUser(newUser)).unwrap()
      setNewUser({ name: "", email: "", role: "user" })
      toast({
        title: "User Added",
        description: "New user has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async () => {
    // Implement update user logic here
  }

  const handleDeleteUser = async (userId: number) => {
    // Implement delete user logic here
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="flex items-center justify-between py-4">
            {editingUser?.id === user.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setEditingUser(null)}>Cancel</Button>
                  <Button onClick={handleUpdateUser}>Save</Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

