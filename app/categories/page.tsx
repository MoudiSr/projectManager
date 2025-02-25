import CategoriesTable from "@/components/categories/categories-table"
import { getCategories } from "@/actions/categories"
import { getProjects } from "@/actions/projects"

const Page = async () => {

    const { projects } = await getProjects()
    const { categories } = await getCategories()

    return (
        <>
            <CategoriesTable items={categories} projects={projects} />
        </>
    )
}

export default Page