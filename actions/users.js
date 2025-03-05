'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: [
                {
                    id: 'desc',
                }
            ]
        })

        return { users }
    } catch (error) {
        return { error: "Error fetching users!!" }
    }
}

export async function addUser(username, password, role) {
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                role
            }
        })

        revalidatePath("/")
        revalidatePath("/accounts")
        return { newUser }
    } catch (error) {
        return { error: "Failed to create user!!" }
    }
}

export async function deleteUser(id) {
    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: id
            }
        })

        revalidatePath("/")
        revalidatePath("/accounts")
        return { deletedUser }
    } catch (error) {
        return { error: "Failed to delete user!!" }
    }
}

export async function editUser(user, password, role) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                role: role !== "" ? role : user.role,
                password: password !== "" ? password : user.password
            }
        })

        revalidatePath("/")
        revalidatePath("/accounts")
        return { updatedUser }
    } catch (error) {
        return { error: "Failed to update user!!" }
    }
}
