"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  type Ticket,
  type TicketId,
  type TicketStatus,
  type UserId,
  type CommentId,
  getTickets,
  getTicket,
  updateTicketStatus,
  assignTicket,
  addComment as apiAddComment,
  submitRating,
  editComment as apiEditComment,
  deleteComment as apiDeleteComment,
} from "../lib/api"
import { logError } from "../utils/errorLogging"

interface TicketsState {
  tickets: Ticket[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: TicketsState = {
  tickets: [],
  status: "idle",
  error: null,
}

export const fetchTickets = createAsyncThunk("tickets/fetchTickets", async (_, { rejectWithValue }) => {
  try {
    const response = await getTickets()
    return response
  } catch (error) {
    logError(error, "fetchTickets")
    return rejectWithValue("Failed to fetch tickets. Please try again later.")
  }
})

export const fetchTicket = createAsyncThunk("tickets/fetchTicket", async (ticketId: TicketId, { rejectWithValue }) => {
  try {
    const response = await getTicket(ticketId)
    if (!response) {
      throw new Error("Ticket not found")
    }
    return response
  } catch (error) {
    logError(error, `fetchTicket (ID: ${ticketId})`)
    return rejectWithValue("Failed to fetch ticket details. Please try again later.")
  }
})

export const updateStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ ticketId, status, userId }: { ticketId: TicketId; status: TicketStatus; userId: UserId }, { rejectWithValue }) => {
    try {
      const response = await updateTicketStatus(ticketId, status, userId)
      if (!response) {
        throw new Error("Failed to update ticket status")
      }
      return response
    } catch (error) {
      logError(error, `updateStatus (ID: ${ticketId}, Status: ${status})`)
      return rejectWithValue("Failed to update ticket status. Please try again later.")
    }
  },
)
export const assignUser = createAsyncThunk(
  "tickets/assignUser",
  async ({ ticketId, userId }: { ticketId: TicketId; userId: UserId }, { rejectWithValue }) => {
    try {
      const response = await assignTicket(ticketId, userId)
      if (!response) {
        throw new Error("Failed to assign user to ticket")
      }
      return response
    } catch (error) {
      logError(error, `assignUser (TicketID: ${ticketId}, UserID: ${userId})`)
      return rejectWithValue("Failed to assign user to ticket. Please try again later.")
    }
  },
)

export const addComment = createAsyncThunk(
  "tickets/addComment",
  async (
    { ticketId, userId, content }: { ticketId: TicketId; userId: UserId; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiAddComment(ticketId, userId, content)
      return { ticketId, comment: response }
    } catch (error) {
      logError(error, `addComment (TicketID: ${ticketId}, UserID: ${userId})`)
      return rejectWithValue("Failed to add comment. Please try again later.")
    }
  },
)

export const submitTicketRating = createAsyncThunk(
  "tickets/submitRating",
  async (
    { ticketId, rating, feedback }: { ticketId: TicketId; rating: number; feedback: string },
    { rejectWithValue },
  ) => {
    try {
      await submitRating(ticketId, rating, feedback)
      return { ticketId, rating }
    } catch (error) {
      logError(error, `submitTicketRating (TicketID: ${ticketId})`)
      return rejectWithValue("Failed to submit rating. Please try again later.")
    }
  },
)

export const editComment = createAsyncThunk(
  "tickets/editComment",
  async (
    { ticketId, commentId, content }: { ticketId: TicketId; commentId: CommentId; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiEditComment(ticketId, commentId, content)
      return { ticketId, comment: response }
    } catch (error) {
      logError(error, `editComment (TicketID: ${ticketId}, CommentID: ${commentId})`)
      return rejectWithValue("Failed to edit comment. Please try again later.")
    }
  },
)

export const deleteComment = createAsyncThunk(
  "tickets/deleteComment",
  async ({ ticketId, commentId }: { ticketId: TicketId; commentId: CommentId }, { rejectWithValue }) => {
    try {
      await apiDeleteComment(ticketId, commentId)
      return { ticketId, commentId }
    } catch (error) {
      logError(error, `deleteComment (TicketID: ${ticketId}, CommentID: ${commentId})`)
      return rejectWithValue("Failed to delete comment. Please try again later.")
    }
  },
)

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.status = "succeeded"
        state.tickets = action.payload
        state.error = null
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(fetchTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id)
        if (index !== -1) {
          state.tickets[index] = action.payload
        } else {
          state.tickets.push(action.payload)
        }
        state.error = null
      })
      .addCase(updateStatus.fulfilled, (state, action: PayloadAction<Ticket>) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id)
        if (index !== -1) {
          state.tickets[index] = action.payload
        }
        state.error = null
      })
      .addCase(assignUser.fulfilled, (state, action: PayloadAction<Ticket>) => {
        const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id)
        if (index !== -1) {
          state.tickets[index] = action.payload
        }
        state.error = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { ticketId, comment } = action.payload
        const ticket = state.tickets.find((t) => t.id === ticketId)
        if (ticket) {
          ticket.comments.push(comment)
        }
        state.error = null
      })
      .addCase(submitTicketRating.fulfilled, (state, action) => {
        const { ticketId, rating } = action.payload
        const ticket = state.tickets.find((t) => t.id === ticketId)
        if (ticket) {
          ticket.rating = rating
        }
        state.error = null
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const { ticketId, comment } = action.payload
        const ticket = state.tickets.find((t) => t.id === ticketId)
        if (ticket) {
          const commentIndex = ticket.comments.findIndex((c) => c.id === comment.id)
          if (commentIndex !== -1) {
            ticket.comments[commentIndex] = comment
          }
        }
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { ticketId, commentId } = action.payload
        const ticket = state.tickets.find((t) => t.id === ticketId)
        if (ticket) {
          ticket.comments = ticket.comments.filter((c) => c.id !== commentId)
        }
        state.error = null
      })
  },
})

export default ticketsSlice.reducer
