'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const getSales = async () => {
    try {
        const sales = await prisma.sale.findMany({
            orderBy: [
                {
                    id: 'desc'
                }
            ],
            include: {
                project: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return { sales }
    } catch (error) {
        return { error: "Error fetching sales!!" }
    }
}

export const addSale = async (project, price, customerName, customerPhone, saleDate) => {
    try {
        const newSale = await prisma.sale.create({
            data: {
                projectId: project.id,
                price,
                customerName,
                customerPhone,
                saleDate: new Date(saleDate)
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        revalidatePath("/sales")
        return { newSale }
    } catch (error) {
        return { error: "Error adding sales!!" }
    }
}