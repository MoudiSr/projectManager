'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: [
                {
                    id: 'desc',
                }
            ]
        })

        return { categories }
    } catch (error) {
        return { error: "Error fetching categories!!" }
    }
}

export async function addCategory(name) {
    try {
        const newCategory = await prisma.category.create({
            data: {
                name: name,
                numOfItems: 0
            }
        })
        
        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { newCategory }
    } catch (error) {
        return { error: "Failed to create category!!" }
    }
}

export async function deleteCategory(id) {
    try {
        const deletedCategory = await prisma.category.delete({
            where: {
                id: id
            }
        })
        
        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { deletedCategory }
    } catch (error) {
        return { error: "Failed to create category!!" }
    }
}
