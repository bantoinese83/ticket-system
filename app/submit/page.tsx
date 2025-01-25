"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitTicket } from "../lib/api"
import { enhanceTicketDescription, analyzeScreenshot } from "../utils/geminiApi"
import { useToast } from "@/components/ui/use-toast"

export default function SubmitTicket() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [enhancedDescription, setEnhancedDescription] = useState("")
  const [location, setLocation] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title && (description || enhancedDescription) && location) {
      try {
        await submitTicket({
          title,
          description: enhancedDescription || description,
          location,
          screenshot,
        })
        toast({
          title: "Ticket Submitted",
          description: "Your accessibility issue has been successfully reported.",
        })
        router.push("/")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit ticket. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEnhanceDescription = async () => {
    if (description) {
      setIsEnhancing(true)
      try {
        const enhanced = await enhanceTicketDescription(description)
        setEnhancedDescription(enhanced)
        toast({
          title: "Description Enhanced",
          description: "The ticket description has been enhanced with AI assistance.",
        })
      } catch (error) {
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

  const handleScreenshotAnalysis = async () => {
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
      } catch (error) {
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <Button
            type="button"
            onClick={handleEnhanceDescription}
            disabled={!description || isEnhancing}
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
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="screenshot">Screenshot</Label>
          <Input
            id="screenshot"
            type="file"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            accept="image/*"
          />
          {screenshot && (
            <Button type="button" onClick={handleScreenshotAnalysis} disabled={isAnalyzing} className="mt-2">
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

