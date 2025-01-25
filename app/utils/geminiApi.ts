import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

// Function to generate enhanced ticket descriptions
export async function enhanceTicketDescription(description: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const prompt = `Enhance the following accessibility issue description with more details and technical specificity: "${description}"`
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("Error enhancing ticket description:", error)
    return description // Return original description if there's an error
  }
}

// Function to analyze screenshots for accessibility issues
export async function analyzeScreenshot(imageBase64: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png",
      },
    }
    const prompt = "Analyze this screenshot and identify any potential accessibility issues."
    const result = await model.generateContent([prompt, imagePart])
    return result.response.text()
  } catch (error) {
    console.error("Error analyzing screenshot:", error)
    return "Unable to analyze the screenshot. Please review manually."
  }
}

// Function to suggest solutions for accessibility issues
export async function suggestSolutions(issue: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const prompt = `Suggest potential solutions for the following accessibility issue: "${issue}"`
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("Error suggesting solutions:", error)
    return "Unable to suggest solutions at this time. Please consult accessibility guidelines."
  }
}

