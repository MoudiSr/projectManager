import CategoriesTable from "@/components/categories/categories-table"
import { getCategories } from "@/actions/categories"
import { getProjects } from "@/actions/projects"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const Page = async () => {
    // const session = await getServerSession(authOptions)

    // if (!session) {
    //     return redirect("/login")
    // }

    const { projects } = await getProjects()
    const { categories } = await getCategories()

    return (
        <>
            <CategoriesTable items={categories} projects={projects} />
        </>
    )
}

export default Page