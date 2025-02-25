'use client'
import { Button, Link } from "@heroui/react"

export default function DashboardMain() {
    return (
        <Link href="/projects">
            <Button>Go to projects</Button>
        </Link>
    )
}