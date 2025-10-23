import AuthForm from "../components/auth-form";
import HomePage from "./home";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-10 ">
            <HomePage />
            {/* <AuthForm /> */}
        </div>
    )
}
