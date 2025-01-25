"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitTicket } from "../lib/api"
import { enhanceTicketDescription, analyzeScreenshot } from "../utils/geminiApi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  screenshot: z.instanceof(File).optional(),
})

export default function SubmitTicket() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),
  })
  const [enhancedDescription, setEnhancedDescription] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState("")

  const onSubmit = async (data) => {
    try {
      await submitTicket({
        ...data,
        description: enhancedDescription || data.description,
      })
      toast({
        title: "Ticket Submitted",
        description: "Your accessibility issue has been successfully reported.",
      })
      router.push("/")
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEnhanceDescription = async (description) => {
    if (description) {
      setIsEnhancing(true)
      try {
        const enhanced = await enhanceTicketDescription(description)
        setEnhancedDescription(enhanced)
        toast({
          title: "Description Enhanced",
          description: "The ticket description has been enhanced with AI assistance.",
        })
      } catch {
        toast({
          title: "Enhancement Failed",
          description: "Failed to enhance description. Please review manually.",
          variant: "destructive",
        })
      } finally {
        setIsEnhancing(false)
      }
    }
  }

  const handleScreenshotAnalysis = async (screenshot) => {
    if (screenshot) {
      setIsAnalyzing(true)
      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64 = reader.result as string
          const analysis = await analyzeScreenshot(base64.split(",")[1])
          setAnalysisResult(analysis)
          toast({
            title: "Screenshot Analyzed",
            description: "The screenshot has been analyzed for accessibility issues.",
          })
        }
        reader.readAsDataURL(screenshot)
      } catch {
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze screenshot. Please review manually.",
          variant: "destructive",
        })
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Submit New Accessibility Issue</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          <Button
            type="button"
            onClick={() => handleEnhanceDescription(watch("description"))}
            disabled={!watch("description") || isEnhancing}
            className="mt-2"
          >
            {isEnhancing ? "Enhancing..." : "Enhance Description with AI"}
          </Button>
        </div>
        {enhancedDescription && (
          <div>
            <Label htmlFor="enhancedDescription">Enhanced Description</Label>
            <Textarea
              id="enhancedDescription"
              value={enhancedDescription}
              onChange={(e) => setEnhancedDescription(e.target.value)}
              className="mt-2"
            />
          </div>
        )}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        </div>
        <div>
          <Label htmlFor="screenshot">Screenshot</Label>
          <Input id="screenshot" type="file" {...register("screenshot")} accept="image/*" />
          {watch("screenshot") && (
            <Button type="button" onClick={() => handleScreenshotAnalysis(watch("screenshot"))} disabled={isAnalyzing} className="mt-2">
              {isAnalyzing ? "Analyzing..." : "Analyze Screenshot"}
            </Button>
          )}
        </div>
        {analysisResult && (
          <div>
            <Label htmlFor="analysis">Screenshot Analysis</Label>
            <Textarea id="analysis" value={analysisResult} readOnly className="mt-2" />
          </div>
        )}
        <Button type="submit">Submit Ticket</Button>
      </form>
    </div>
  )
}