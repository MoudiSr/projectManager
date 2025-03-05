import LoginPage from "@/components/login/login-page"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await getServerSession(authOptions)

    if (session) {
        return redirect("/")
    }

    return (
        <LoginPage />
    )
}

export default Page