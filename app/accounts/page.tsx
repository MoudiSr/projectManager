import AccountsTable from "@/components/accounts/accounts-tables"
import { getUsers } from "@/actions/users"

const Page = async () => {
    const { users } = await getUsers() 

    return (
        <>
            <AccountsTable items={users}/>
        </>
    )
}

export default Page