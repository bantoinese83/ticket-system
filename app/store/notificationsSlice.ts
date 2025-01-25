"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { logError } from "../utils/errorLogging"

export interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  createdAt: string
  read: boolean
}

interface NotificationsState {
  notifications: Notification[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: NotificationsState = {
  notifications: [],
  status: "idle",
  error: null,
}

export const fetchNotifications = createAsyncThunk("notifications/fetchNotifications", async () => {
  // In a real app, this would be an API call
  return []
})

export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    }
    // In a real app, this would be an API call
    return newNotification
  },
)

export const markNotificationAsRead = createAsyncThunk("notifications/markAsRead", async (notificationId: string) => {
  // In a real app, this would be an API call
  return notificationId
})

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = "succeeded"
        state.notifications = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch notifications"
      })
      .addCase(addNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.notifications.unshift(action.payload)
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const notification = state.notifications.find((n) => n.id === action.payload)
        if (notification) {
          notification.read = true
        }
      })
  },
})

export default notificationsSlice.reducer
