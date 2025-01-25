import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

const SignIn = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Sign In</h1>
      <div className="space-y-4">
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
      </div>
    </div>
  )
}

export default SignIn
