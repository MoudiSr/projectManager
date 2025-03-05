'use client'
import { Link, Button } from "@heroui/react"


const UnauthorizedMain = () => {
    return (
        <div className="flex flex-col items-center gap-y-4">
            <h1 className="text-3xl text-center select-none p-2">You are not <span className="bg-secondary px-1 underline">authorized</span> to access this page</h1>
            <Link href="/" className="title text-2xl border-1 p-2 rounded-md hover:underline bg-primary text-background">Return to Dashboard</Link>
        </div>
    )
}

export default UnauthorizedMain