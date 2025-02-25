'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const addTask = async (project, name, cost, timeNeeded) => {
    try {
        const newTask = await prisma.task.create({
            data: {
                name,
                cost,
                status: "Pending",
                timeNeeded,
                projectId: project.id
            }
        })

        const updateProjectPrice = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                price: project.price + cost
            }
        })

        if (project.status === "Initialized") {
            const updateStatus = await prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    status: "Pending"
                }
            })
        }

        const tasks = await prisma.task.findMany({
            where: {
                projectId: project.id
            }
        })

        const updateProjectProgress = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                status: tasks.filter(task => task.status === "Done").length === tasks.length ? "Finished" : "Pending",
                progress: tasks.filter(task => task.status === "Done").length * 100 / tasks.length
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { newTask }
    } catch (error) {
        return error
    }
}

export const finishTask = async (task, project) => {
    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: task.id
            },
            data: {
                status: "Done"
            }
        })

        const tasks = await prisma.task.findMany({
            where: {
                projectId: project.id
            }
        })

        const updateProjectProgress = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                status: tasks.length === 0 ? "Initialized" : tasks.filter(task => task.status === "Done").length === tasks.length ? "Finished" : "Pending",
                progress: tasks.filter(task => task.status === "Done").length * 100 / tasks.length
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { updatedTask }
    } catch (error) {
        return error
    }
}

export const deleteTask = async (task, project) => {
    try {
        const deletedTask = await prisma.task.delete({
            where: {
                id: task.id
            }
        })

        const updateProjectPrice = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                price: project.price - task.cost
            }
        })

        const tasks = await prisma.task.findMany({
            where: {
                projectId: project.id
            }
        })

        const updateProjectProgress = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                status: tasks.length === 0 ? "Initialized" : tasks.filter(task => task.status === "Done").length === tasks.length ? "Finished" : "Pending",
                progress: tasks.length === 0 ? 0 : tasks.filter(task => task.status === "Done").length * 100 / tasks.length
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { deletedTask }
    } catch (error) {
        return error
    }
}

export const finishAllTasks = async (project) => {
    try {
        const tasks = await prisma.task.updateMany({
            where: {
                projectId: project.id
            },
            data: {
                status: "Done"
            }
        })

        const updateProjectProgress = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                status: "Finished",
                progress: 100
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { updateProjectProgress }
    } catch (error) {
        return error
    }
}

export const cancelAllTasks = async (project) => {
    try {
        const tasks = await prisma.task.deleteMany({
            where: {
                projectId: project.id
            }
        })

        const updateProjectProgress = await prisma.project.update({
            where: {
                id: project.id
            },
            data: {
                status: "Initialized",
                progress: 0,
                price: 0
            }
        })

        revalidatePath("/")
        revalidatePath("/categories")
        revalidatePath("/projects")
        return { updateProjectProgress }
    } catch (error) {
        return error
    }
}