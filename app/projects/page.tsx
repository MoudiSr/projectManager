import { getCategories } from "@/actions/categories"
import { getProjects } from "@/actions/projects"
import ProductsTable from "@/components/projects/projects-table"

const Page = async () => {
    const { projects } = await getProjects()
    const { categories } = await getCategories()

    return (
        <>
            <ProductsTable items={projects} categories={categories} />
        </>
    )
}

export default Page