"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRef, useState, FormEvent } from "react"

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
    const emailInput = useRef<HTMLInputElement | null>(null)
    const passwordInput = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    async function submitHandler(event: FormEvent) {
        event.preventDefault()
        const enteredEmail = emailInput.current?.value
        const enteredPassword = passwordInput.current?.value

        if (!enteredEmail || !enteredPassword) {
            // Simple validation: don't proceed if missing
            return
        }

        if (hasAccount) {
            const result = await signIn("credentials", {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword
            })
            if (!result?.error) {
                router.push("/profile")
            } else {
                console.error("Login failed: ", result.error)
            }
        } else {
            try {
                const result = await createUser(enteredEmail, enteredPassword)
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        }
    }

    function switchAuthModeHandler() {
        setHasAccount((prevState) => !prevState)
    }

    return (
        <section >
            <h1 >{hasAccount ? "Login" : "Sign Up"}</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input className="border rounded-lg bg-gray-100" type="email" id="email" required ref={emailInput} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input className="border rounded-lg bg-gray-100" type="password" id="password" required ref={passwordInput} />
                </div>
                <div className="flex flex-col gap-2 mt-4 ">
                    <button>{hasAccount ? "Login" : "Create account"}</button>
                    <button onClick={switchAuthModeHandler}>
                        {hasAccount ? "Create new account" : "Login with existing account"}
                    </button>
                </div>
            </form>
        </section>
    )
}