import { getProjects } from "@/actions/projects"
import { getSales } from "@/actions/sales"
import SalesTable from "@/components/sales/sales-table"

const Page = async () => {
    const { sales } = await getSales()
    const { projects } = await getProjects()

    return (
        <>
            <SalesTable items={sales} projects={projects?.filter(project => project.status === "Finished")} />
        </>
    )
}

export default Page