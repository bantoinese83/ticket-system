"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchUsers, addUser, updateUser, deleteUser } from "../store/usersSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import type { User, UserRole } from "../lib/api"
import { useAuth } from "../hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]),
})

export function UserManagement() {
  const { can } = useAuth()
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const status = useAppSelector((state) => state.users.status)
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers())
    }
  }, [status, dispatch])

  if (!can("manage_users")) {
    return <div>You do not have permission to manage users.</div>
  }

  const handleAddUser = async (data) => {
    try {
      await dispatch(addUser(data)).unwrap()
      reset()
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
    if (editingUser) {
      try {
        await dispatch(updateUser(editingUser)).unwrap()
        setEditingUser(null)
        toast({
          title: "User Updated",
          description: "User details have been successfully updated.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap()
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleAddUser)} className="flex flex-col space-y-2">
            <Input
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            <Input
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <Select {...register("role")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            <Button type="submit">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </form>
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