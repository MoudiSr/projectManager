'use client'
import { Button, Link } from "@heroui/react"
import { Sale } from "../sales/sales-table"

export default function DashboardMain({ sales = [] } : {
    sales: Sale[] | undefined
}) {
    return (
        <Link href="/projects">
            <Button>Go to projects</Button>
        </Link>
    )
}