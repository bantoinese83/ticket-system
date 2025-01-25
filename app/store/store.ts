import { configureStore } from "@reduxjs/toolkit"
import ticketsReducer from "./ticketsSlice"
import usersReducer from "./usersSlice"
import notificationsReducer from "./notificationsSlice"

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

