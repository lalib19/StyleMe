"use client"

import { signIn } from "next-auth/react"
import { useRef, useState, FormEvent } from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"
import { useAppSelector } from "../store/hooks"

async function createUser(email: string, password: string) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
    }
    return data
}

async function storeFavoriteItemsInDb(userEmail: string, favoriteItems: number[]) {
    const response = await fetch("/api/favorites", {
        method: "PUT",
        body: JSON.stringify({ userEmail, favoriteItems }),
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || "Failed to store favorite items")
    }

    return data
}

export default function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [hasAccount, setHasAccount] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const emailInput = useRef<HTMLInputElement | null>(null)
    const passwordInput = useRef<HTMLInputElement | null>(null)
    const favoriteItems = useAppSelector((state) => state.cart.items);


    async function submitHandler(event: FormEvent) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        const enteredEmail = emailInput.current?.value
        const enteredPassword = passwordInput.current?.value

        if (!enteredEmail || !enteredPassword) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        if (hasAccount) {
            if (favoriteItems && favoriteItems.length > 0) {
                try {
                    await storeFavoriteItemsInDb(enteredEmail, favoriteItems);
                } catch (favoriteError) {
                    console.error("Failed to store favorites:", favoriteError);
                }
            }

            const result = await signIn("credentials", {
                email: enteredEmail,
                password: enteredPassword
            })

            if (result?.error) {
                setError(result.error ? result.error
                    : "Invalid email or password")
                setIsLoading(false)
            }
        } else {
            try {
                const result = await createUser(enteredEmail, enteredPassword);

                if (favoriteItems && favoriteItems.length > 0) {
                    await storeFavoriteItemsInDb(enteredEmail, favoriteItems);
                }
                await signIn("credentials", {
                    email: enteredEmail,
                    password: enteredPassword
                })
            } catch (error) {
                setError(error instanceof Error ? error.message : "Something went wrong")
            } finally {
                setIsLoading(false)
            }
        }
    }

    function switchAuthModeHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setHasAccount((prevState) => !prevState)
        setError(null)
    }

    return (
        <section className="flex flex-col items-center max-w-xl mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold">{hasAccount ? "Login" : "Sign Up"}</h1>

            {error && (
                <div className="w-full p-3 mt-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form className="gap-3 w-full p-5 flex flex-col items-center" onSubmit={submitHandler}>
                <Input htmlFor="email" label="Email" type="email" id="email" required ref={emailInput} />
                <Input htmlFor="password" label="Password" type="password" id="password" required ref={passwordInput} />
                <Button className="" disabled={isLoading}
                >{hasAccount ? "Login" : "Create account"}
                </Button>
                <Button onClick={switchAuthModeHandler} className="bg-transparent text-black-600 hover:bg-transparent underline">
                    {hasAccount ? "Or create a new account here" : "Already have an account ?"}
                </Button>
            </form>
        </section>
    )
}