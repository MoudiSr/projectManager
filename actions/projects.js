'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"


export const getProjects = async () => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: [
                {
                    id: 'desc'
                }
            ],
            include: {
                category: true
            }
        })

        return { projects }
    } catch (error) {
        return { error: "Error fetching projects!!" }
    }
}

export const addProject = async (name, description, category, startDate, endDate) => {
    try {
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                price: 0,
                progress: 0,
                status: "Initialized",
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                categoryId: category.id
            }
        })

        const updateCategoryNumOfItems = await prisma.category.update({
            where: {
                id: category.id
            },
            data: {
                numOfItems: category.numOfItems + 1
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { newProject }
    } catch (error) {
        return error
    }
}

export const editProject = async (id, name, description, category, prevCategory, startDate, endDate) => {
    try {
        const newProject = await prisma.project.update({
            where: {
                id
            },
            data: {
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                categoryId: category.id
            }
        })

        if (prevCategory.id !== category.id) {
            const updateCategoryNumOfItems = await prisma.category.update({
                where: {
                    id: category.id
                },
                data: {
                    numOfItems: category.numOfItems + 1
                }
            })
            const updateCategoryNumOfItemsPrev = await prisma.category.update({
                where: {
                    id: prevCategory.id
                },
                data: {
                    numOfItems: prevCategory.numOfItems - 1
                }
            })
        }

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { newProject }
    } catch (error) {
        return error
    }
}

export const getProject = async (id) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                category: true
            }
        })

        const tasks = await prisma.task.findMany({
            where: {
                projectId: id
            },
            orderBy: [
                {
                    id: 'asc'
                }
            ]
        })

        return { project, tasks }
    } catch (error) {
        return { error: "Error fetching projects!!" }
    }
}

export const deleteProject = async (project) => {
    try {
        const deletedProject = await prisma.project.delete({
            where: {
                id: project.id
            }
        })

        const updateCategoryNumOfItems = await prisma.category.update({
            where: {
                id: project.category.id
            },
            data: {
                numOfItems: project.category.numOfItems - 1
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { deletedProject }
    } catch (error) {
        return error
    }
}



