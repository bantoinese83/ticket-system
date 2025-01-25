"use client"

import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {getUser, getUsers, type User, type UserId} from "../lib/api"
import {logError} from "../utils/errorLogging"
import { signOut } from "next-auth/react"

interface UsersState {
  users: User[]
  currentUser: User | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getUsers()
})

export const fetchUser = createAsyncThunk("users/fetchUser", async (userId: UserId) => {
  return await getUser(userId)
})

// Add the missing addUser function
export const addUser = createAsyncThunk("users/addUser", async (userData: Omit<User, "id">, { rejectWithValue }) => {
  try {
    // Simulating API call to add a new user
    const newUser: User = {
      id: Math.floor(Math.random() * 10000), // Generate a random ID (in a real app, this would be done by the backend)
      ...userData,
    }
    return newUser
  } catch (error) {
    logError(error, "addUser")
    return rejectWithValue("Failed to add user. Please try again later.")
  }
})

export const signOutUser = createAsyncThunk("users/signOutUser", async () => {
  await signOut()
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded"
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch users"
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User | undefined>) => {
        if (action.payload) {
          const index = state.users.findIndex((user) => user.id === action.payload!.id)
          if (index !== -1) {
            state.users[index] = action.payload
          } else {
            state.users.push(action.payload)
          }
          state.currentUser = action.payload
        }
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload)
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.currentUser = null
      })
  },
})

export default usersSlice.reducer
