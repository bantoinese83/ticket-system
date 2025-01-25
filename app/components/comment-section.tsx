"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch } from "../store/hooks"
import { addComment, editComment, deleteComment } from "../store/ticketsSlice"
import type { Comment, TicketId, UserId, CommentId } from "../lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"

interface CommentSectionProps {
  ticketId: TicketId
  comments: Comment[]
}

export function CommentSection({ ticketId, comments }: CommentSectionProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<CommentId | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      setIsSubmitting(true)
      try {
        // In a real app, you would get the current user's ID
        const currentUserId: UserId = 1 // This is a placeholder
        await dispatch(
          addComment({
            ticketId,
            userId: currentUserId,
            content: newComment,
          }),
        ).unwrap()
        setNewComment("")
        toast({
          title: "Comment Added",
          description: "Your comment has been successfully added.",
        })
      } catch (error) {
        console.error("Error adding comment:", error)
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditComment = async (commentId: CommentId) => {
    if (editedContent.trim()) {
      try {
        await dispatch(
          editComment({
            ticketId,
            commentId,
            content: editedContent,
          }),
        ).unwrap()
        setEditingCommentId(null)
        toast({
          title: "Comment Updated",
          description: "Your comment has been successfully updated.",
        })
      } catch (error) {
        console.error("Error editing comment:", error)
        toast({
          title: "Error",
          description: error as string,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteComment = async (commentId: CommentId) => {
    try {
      await dispatch(
        deleteComment({
          ticketId,
          commentId,
        }),
      ).unwrap()
      toast({
        title: "Comment Deleted",
        description: "Your comment has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      {comments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <Card key={`comment-${comment.id}`}>
              <CardContent className="flex items-start space-x-4 pt-6">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${comment.author}.png`} alt={`User ${comment.author}`} />
                  <AvatarFallback>{`U${comment.author}`}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">User {comment.author}</p>
                  <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
                        <Button onClick={() => handleEditComment(comment.id)}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1">{comment.content}</p>
                  )}
                </div>
                {editingCommentId !== comment.id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCommentId(comment.id)
                        setEditedContent(comment.content)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmitComment} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  )
}
