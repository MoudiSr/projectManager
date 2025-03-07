'use client'
import { signIn } from "next-auth/react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { useState } from "react"
import { addToast, Alert } from "@heroui/react"
import { Eye, EyeClosed } from "lucide-react"
import bcrypt from "bcryptjs"
import { useRouter } from "next/navigation"

const LoginPage = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const router = useRouter()

    const handleSubmit = async () => {
        setIsLoading(true)
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false
        })
        setIsLoading(false)
        console.log(result)

        if (result?.error) {
            setAlert(true)
            addToast({
                color: "danger",
                title: "Authenticaion Failed",
                description: "Incorrect credentials!!",
                timeout: 2000
            })
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        } else {
            router.push("/")
        }

    }
    return (
        <div className="flex justify-center h-auto">
            <div className="grid w-[100%] sm:w-[80%] md:w-[60%] lg:w-[50%] border-1 bg-default-50 gap-y-10 p-8 mb-10">
                <h1 className="text-center text-2xl font-bold"><span className="text-background bg-primary p-1 rounded-sm">Webesters</span> Project Mangement</h1>
                {/* {alert && <Alert color="danger" variant="faded" radius="sm" title="Invalid credentials" />} */}
                <Input variant="faded" placeholder="Enter username" label="Username" isInvalid={alert} labelPlacement="outside" radius="sm" isRequired onChange={e => setUsername(e.target.value)} />
                <Input variant="faded" placeholder="Enter password" type={isVisible ? "text" : "password"} label="Password" endContent={
                    <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setIsVisible(prev => !prev)}
                    >
                        {isVisible ? (
                            <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                            <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                    </button>
                } isInvalid={alert} labelPlacement="outside" radius="sm" isRequired onChange={e => setPassword(e.target.value)} />
                <Button onPress={handleSubmit} variant="shadow" radius="sm" color="secondary" isLoading={isLoading}>Login In</Button>
            </div>
        </div>
    )
}

export default LoginPage