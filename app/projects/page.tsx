import { getCategories } from "@/actions/categories"
import { getProjects } from "@/actions/projects"
import ProjectsTable from "@/components/projects/projects-table"

const Page = async () => {
    const { projects } = await getProjects()
    const { categories } = await getCategories()

    return (
        <>
            <ProjectsTable items={projects} categories={categories} />
        </>
    )
}

export default Page