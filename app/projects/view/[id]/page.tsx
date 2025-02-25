import { getCategories } from "@/actions/categories"
import { getProject } from "@/actions/projects"
import ProjectView from "@/components/projects/project-view"
import { Project } from "@/components/projects/projects-table"
import { Task } from "@/components/projects/projects-table"

const Page = async (props: { 
    params: Promise<{ id: string }>
 }) => {
    const response = await getProject(Number((await props.params).id))
    const project: Project | null | undefined = response.project
    const tasks: Task[] | undefined = response.tasks
    const { categories } = await getCategories()

    return response.project !== null && response.project !== undefined ? (
        <>
            <ProjectView project={project} tasks={tasks} categories={categories} />
        </>
    ) : (
        <h1>Not Found</h1>
    )
}

export default Page