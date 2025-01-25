import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

const SignUp = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Sign Up</h1>
      <div className="space-y-4">
        <Button onClick={() => signIn("google")}>Sign up with Google</Button>
        <Button onClick={() => signIn("github")}>Sign up with GitHub</Button>
      </div>
    </div>
  )
}

export default SignUp
