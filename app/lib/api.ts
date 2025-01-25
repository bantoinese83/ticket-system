export type UserId = number
export type TicketId = number
export type CommentId = number

export type UserRole = "admin" | "user"
export type TicketStatus = "open" | "in-progress" | "resolved"
export type TicketPriority = "low" | "medium" | "high"

export interface User {
  id: UserId
  name: string
  email: string
  role: UserRole
  assignedTickets: TicketId[]
}

export interface StatusChange {
  status: TicketStatus
  changedAt: string
  changedBy: UserId
}

export interface Ticket {
  id: TicketId
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  location: string
  createdAt: string
  updatedAt: string
  assignedTo: UserId | null
  reportedBy: UserId
  comments: Comment[]
  rating?: number
  statusHistory: StatusChange[]
}

export interface Comment {
  id: CommentId
  ticketId: TicketId
  author: UserId
  content: string
  createdAt: string
}

let users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", assignedTickets: [1] },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", assignedTickets: [2] },
]

let tickets: Ticket[] = [
  {
    id: 1,
    title: "Missing alt text on homepage images",
    description: "The images on the homepage do not have alt text, making them inaccessible to screen readers.",
    status: "open",
    priority: "high",
    location: "Homepage",
    createdAt: "2023-06-01T12:00:00Z",
    updatedAt: "2023-06-01T12:00:00Z",
    assignedTo: 1,
    reportedBy: 2,
    comments: [],
    statusHistory: [],
  },
  {
    id: 2,
    title: "Low color contrast in navigation menu",
    description:
      "The navigation menu has low color contrast, making it difficult to read for users with visual impairments.",
    status: "in-progress",
    priority: "medium",
    location: "Global navigation",
    createdAt: "2023-06-02T14:30:00Z",
    updatedAt: "2023-06-03T10:15:00Z",
    assignedTo: 2,
    reportedBy: 1,
    comments: [],
    statusHistory: [],
  },
]

export async function getTickets(): Promise<Ticket[]> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...tickets]), 500)
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw new Error("Failed to fetch tickets")
  }
}

export async function getTicket(id: TicketId): Promise<Ticket | undefined> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = tickets.find((ticket) => ticket.id === id)
        resolve(ticket ? { ...ticket } : undefined)
      }, 500)
    })
  } catch (error) {
    console.error(`Error fetching ticket with ID ${id}:`, error)
    throw new Error("Failed to fetch ticket")
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...users]), 500)
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function getUser(id: UserId): Promise<User | undefined> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find((user) => user.id === id)
        resolve(user ? { ...user } : undefined)
      }, 500)
    })
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    throw new Error("Failed to fetch user")
  }
}

export interface SubmitTicketData {
  title: string
  description: string
  location: string
  priority: TicketPriority
  reportedBy: UserId
  screenshot: File | null
}

export async function submitTicket(ticketData: SubmitTicketData): Promise<Ticket> {
  try {
    const newTicket: Ticket = {
      id: tickets.length + 1,
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      comments: [],
      statusHistory: [],
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        tickets = [...tickets, newTicket]
        resolve({ ...newTicket })
      }, 500)
    })
  } catch (error) {
    console.error("Error submitting ticket:", error)
    throw new Error("Failed to submit ticket")
  }
}

export async function updateTicketStatus(
  id: TicketId,
  status: TicketStatus,
  userId: UserId,
): Promise<Ticket | undefined> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === id)
        if (ticketIndex !== -1) {
          const now = new Date().toISOString()
          const statusChange: StatusChange = {
            status,
            changedAt: now,
            changedBy: userId,
          }
          // Create a new ticket object with the updated status and history
          const updatedTicket = {
            ...tickets[ticketIndex],
            status: status,
            updatedAt: now,
            statusHistory: [...(tickets[ticketIndex].statusHistory || []), statusChange],
          }
          // Replace the old ticket with the updated one
          tickets[ticketIndex] = updatedTicket
          resolve(updatedTicket)
        } else {
          resolve(undefined)
        }
      }, 500)
    })
  } catch (error) {
    console.error(`Error updating ticket status for ticket ID ${id}:`, error)
    throw new Error("Failed to update ticket status")
  }
}

export async function assignTicket(ticketId: TicketId, userId: UserId): Promise<Ticket | undefined> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
        const userIndex = users.findIndex((u) => u.id === userId)
        if (ticketIndex !== -1 && userIndex !== -1) {
          const updatedTicket = {
            ...tickets[ticketIndex],
            assignedTo: userId,
            updatedAt: new Date().toISOString(),
          }
          tickets = [...tickets.slice(0, ticketIndex), updatedTicket, ...tickets.slice(ticketIndex + 1)]
          const updatedUser = {
            ...users[userIndex],
            assignedTickets: [...users[userIndex].assignedTickets, ticketId],
          }
          users = [...users.slice(0, userIndex), updatedUser, ...users.slice(userIndex + 1)]
          resolve({ ...updatedTicket })
        } else {
          resolve(undefined)
        }
      }, 500)
    })
  } catch (error) {
    console.error(`Error assigning user ID ${userId} to ticket ID ${ticketId}:`, error)
    throw new Error("Failed to assign user to ticket")
  }
}

export async function addComment(ticketId: TicketId, userId: UserId, content: string): Promise<Comment> {
  try {
    const newComment: Comment = {
      id: Math.floor(Math.random() * 1000000),
      ticketId,
      author: userId,
      content,
      createdAt: new Date().toISOString(),
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
        if (ticketIndex !== -1) {
          const updatedTicket = {
            ...tickets[ticketIndex],
            comments: [...tickets[ticketIndex].comments, newComment],
            updatedAt: new Date().toISOString(),
          }
          tickets = [...tickets.slice(0, ticketIndex), updatedTicket, ...tickets.slice(ticketIndex + 1)]
        }
        resolve({ ...newComment })
      }, 500)
    })
  } catch (error) {
    console.error(`Error adding comment to ticket ID ${ticketId}:`, error)
    throw new Error("Failed to add comment")
  }
}

export async function editComment(ticketId: TicketId, commentId: CommentId, content: string): Promise<Comment> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
        if (ticketIndex !== -1) {
          const commentIndex = tickets[ticketIndex].comments.findIndex((c) => c.id === commentId)
          if (commentIndex !== -1) {
            const updatedComment = {
              ...tickets[ticketIndex].comments[commentIndex],
              content,
            }
            tickets[ticketIndex].comments[commentIndex] = updatedComment
            resolve({ ...updatedComment })
          }
        }
        resolve({ id: commentId, ticketId, author: 0, content, createdAt: new Date().toISOString() })
      }, 500)
    })
  } catch (error) {
    console.error(`Error editing comment ID ${commentId} for ticket ID ${ticketId}:`, error)
    throw new Error("Failed to edit comment")
  }
}

export async function deleteComment(ticketId: TicketId, commentId: CommentId): Promise<void> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
        if (ticketIndex !== -1) {
          tickets[ticketIndex].comments = tickets[ticketIndex].comments.filter((c) => c.id !== commentId)
        }
        resolve()
      }, 500)
    })
  } catch (error) {
    console.error(`Error deleting comment ID ${commentId} for ticket ID ${ticketId}:`, error)
    throw new Error("Failed to delete comment")
  }
}

export async function submitRating(ticketId: TicketId, rating: number, feedback: string): Promise<void> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
        if (ticketIndex !== -1) {
          const updatedTicket = {
            ...tickets[ticketIndex],
            rating: rating,
            updatedAt: new Date().toISOString(),
          }
          tickets = [...tickets.slice(0, ticketIndex), updatedTicket, ...tickets.slice(ticketIndex + 1)]
          // In a real app, you might want to store the feedback separately
        }
        resolve()
      }, 500)
    })
  } catch (error) {
    console.error(`Error submitting rating for ticket ID ${ticketId}:`, error)
    throw new Error("Failed to submit rating")
  }
}
