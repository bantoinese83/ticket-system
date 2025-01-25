'use client'


import { UserList } from "../components/user-list"

export default function UsersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Users</h1>
      <UserList />
    </div>
  )
}

