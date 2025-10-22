"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRef, useState, FormEvent } from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"

async function createUser(email: string, password: string) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Simething went wrong")
    }
    return data
}

export default function AuthForm() {
    const [hasAccount, setHasAccount] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const emailInput = useRef<HTMLInputElement | null>(null)
    const passwordInput = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    async function submitHandler(event: FormEvent) {
        event.preventDefault()
        setError(null)

        const enteredEmail = emailInput.current?.value
        const enteredPassword = passwordInput.current?.value

        if (!enteredEmail || !enteredPassword) {
            setError("Please fill in all fields")
            return
        }

        if (hasAccount) {
            const result = await signIn("credentials", {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword
            })

            if (result?.error) {
                setError(result.error ? result.error
                    : "Invalid email or password")
            } else if (result?.ok) {
                router.push("/home")
            }
        } else {
            try {
                const result = await createUser(enteredEmail, enteredPassword)
                console.log(result);

            } catch (error) {
                setError(error instanceof Error ? error.message : "Something went wrong")
            }
        }
    }

    function switchAuthModeHandler() {
        setHasAccount((prevState) => !prevState)
        setError(null)
    }

    return (
        <section className="flex flex-col items-center max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold">{hasAccount ? "Login" : "Sign Up"}</h1>

            {error && (
                <div className="w-full p-3 mt-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form className="gap-3 max-w-md p-5 flex flex-col items-center" onSubmit={submitHandler}>
                <Input htmlFor="email" label="Email" type="email" id="email" required ref={emailInput} />
                <Input htmlFor="password" label="Password" type="password" id="password" required ref={passwordInput} />
                <Button
                >{hasAccount ? "Login" : "Create account"}
                </Button>
                <Button onClick={switchAuthModeHandler}>
                    {hasAccount ? "Create new account" : "Login with existing account"}
                </Button>
            </form>
        </section>
    )
}