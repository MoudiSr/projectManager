'use client';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue, Input, Button, Tooltip, Chip, CircularProgress, Link } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FolderPlus, Search, Trash2, Eye, PenLine } from "lucide-react";
import { Category } from "@/components/categories/categories-table";
import ProjectAddModal from "./project-add-modal";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";


export interface Project {
    id: number
    name: string
    description: string
    price: number
    progress: number
    categoryId: number
    category: Category
    status: string
    startDate: Date
    endDate: Date
}

export interface Task {
    id: Number
    name: String
    status: String
    cost: Number
    timeNeeded: Number
    projectId: Number
}

interface Column {
    key: keyof Project | number;
    label: string;
    isSortable: boolean;
}

interface SortDescriptor {
    column: keyof Project;
    direction: "ascending" | "descending";
}

const ProjectsTable = ({ items = [], categories = [] }: {
    items?: Project[],
    categories?: Category[]
}) => {

    const columns: Column[] = [
        { key: "name", label: "Project", isSortable: false },
        { key: "price", label: "Price ( in $ )", isSortable: true },
        { key: "progress", label: "Progress %", isSortable: true },
        { key: "status", label: "Status", isSortable: true },
        { key: "categoryId", label: "Category", isSortable: true },
        { key: "startDate", label: "Calendar", isSortable: true },
        { key: "id", label: "Actions", isSortable: false }
    ];

    const [filterValue, setFilterValue] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);


    const filteredItems = useMemo(() => {
        return items.filter((item) =>
            item.name.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [items, filterValue]);

    const clear = useCallback(() => {
        setFilterValue("");
    }, []);

    const onSearchChange = useCallback((value: string) => {
        setFilterValue(value || "");
    }, []);

    const sortedItems = useMemo(() => {
        if (!sortDescriptor) return filteredItems;

        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const [addOpen, setAddOpen] = useState(false)

    useEffect(() => {
        console.log(items)
    }, [])

    const [currentProject, setCurrentProject] = useState<Project | null>(null)

    const { data: session } = useSession()

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <Input
                    startContent={<Search className="size-5" />}
                    isClearable
                    placeholder="Search for project..."
                    value={filterValue}
                    onClear={clear}
                    onValueChange={onSearchChange}
                />

                <Tooltip content="Add project" placement="top-end" showArrow>
                    <Button color="primary" isIconOnly startContent={<FolderPlus className="size-5" />} isDisabled={session !== undefined && session?.user !== undefined ? session?.user.role === "user" : true} onPress={() => setAddOpen(true)}></Button>
                </Tooltip>
            </div>
            <Table
                isStriped
                aria-label="Categories table"
                sortDescriptor={sortDescriptor as any}
                onSortChange={setSortDescriptor as any}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key} allowsSorting={column.isSortable}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{
                                columnKey === "name" ?
                                    <div className="flex flex-col">
                                        <span className="text-md">{item.name}</span>
                                    </div>
                                    : columnKey === "price" ?
                                        <Chip color={item.price === 0 ? "danger" : "success"} variant="flat">
                                            {getKeyValue(item, columnKey)} $
                                        </Chip>
                                        : columnKey == "progress" ?
                                            <CircularProgress size="lg" color="success" showValueLabel value={item.progress} />
                                            : columnKey == "categoryId" ?
                                                <Chip color="primary" className="rounded-sm">
                                                    {item.category.name}
                                                </Chip>
                                                : columnKey == "status" ?
                                                    <Chip color={item.status === "Pending" ? "warning" : item.status === "Finished" ? "success" : "primary"} className={item.status === "Pending" ? "text-warning" : item.status === "Finished" ? "text-success" : "text-primary"} variant="dot">
                                                        {getKeyValue(item, columnKey)}
                                                    </Chip>
                                                    : columnKey === "id" ?
                                                        <Button
                                                            color="secondary"
                                                            variant="shadow"
                                                            className="rounded-md"
                                                            isIconOnly
                                                            as={Link}
                                                            href={`/projects/view/${item.id}`}
                                                            startContent={<Eye className="size-5" />}>

                                                        </Button>
                                                        : columnKey === "startDate" ?
                                                            <div className="grid gap-y-2">
                                                                <Chip size="sm" className="bg-foreground-200" radius="sm">{item.startDate.toDateString()}</Chip>
                                                                <Separator className="w-28" />
                                                                <Chip size="sm" className="bg-foreground-200" radius="sm">{item.endDate.toDateString()}</Chip>
                                                            </div>
                                                            : getKeyValue(item, columnKey)
                            }</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ProjectAddModal open={addOpen} setOpen={setAddOpen} categories={categories} />
        </div>
    );
};

export default ProjectsTable;
