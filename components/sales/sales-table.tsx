'use client';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue, Input, Button, Tooltip, Chip, CircularProgress, Link } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FolderPlus, Search, Trash2, Eye, PenLine, BadgePlus, Trash } from "lucide-react";
import { Category } from "@/components/categories/categories-table";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import { Project } from "@/components/projects/projects-table";
import SaleAddModal from "./sales-add-modal";
import SaleDeleteModal from "./sales-delete-modal";


export interface Sale {
    id: number
    projectId: number
    price: number
    customerName: string
    customerPhone: string
    saleDate: Date
    project: Project
}


interface Column {
    key: keyof Sale | string;
    label: string;
    isSortable: boolean;
}

interface SortDescriptor {
    column: keyof Sale;
    direction: "ascending" | "descending";
}

const SalesTable = ({ items = [], projects = [] }: {
    items?: Sale[] | undefined,
    projects: Project[] | undefined
}) => {

    const columns: Column[] = [
        { key: "projectId", label: "Project", isSortable: true },
        { key: "costs", label: "Cost", isSortable: true },
        { key: "price", label: "Price", isSortable: true },
        { key: "profit", label: "Profit", isSortable: true },
        { key: "customerName", label: "Customer Name", isSortable: true },
        { key: "customerPhone", label: "Customer Phone", isSortable: true },
        { key: "saleDate", label: "Date", isSortable: true },
        { key: "id", label: "Actions", isSortable: false }
    ];

    const [filterValue, setFilterValue] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);


    const filteredItems = useMemo(() => {
        return items.filter((item) =>
            item.project.name.toLowerCase().includes(filterValue.toLowerCase())
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

    const [currentItem, setCurrentItem] = useState<Sale | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const { data: session } = useSession()

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <Input
                    startContent={<Search className="size-5" />}
                    isClearable
                    placeholder="Search in sales..."
                    value={filterValue}
                    onClear={clear}
                    onValueChange={onSearchChange}
                />

                <Tooltip content="Add sales" placement="top-end" showArrow>
                    <Button color="primary" isIconOnly startContent={<BadgePlus className="size-5" />} isDisabled={session !== undefined && session?.user !== undefined ? session?.user.role === "user" : true} onPress={() => setAddOpen(true)}></Button>
                </Tooltip>
            </div>
            <Table
                isStriped
                aria-label="Sales table"
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
                                columnKey === "price" ?
                                    <Chip color={item.price <= item.project.price ? "danger" : "success"} radius="sm" variant="faded">
                                        {getKeyValue(item, columnKey)} $
                                    </Chip>
                                    : columnKey === "id" ?
                                        <div className="flex gap-2">
                                            <Button
                                                color="secondary"
                                                variant="shadow"
                                                className="rounded-md"
                                                isIconOnly
                                                as={Link}
                                                href={`/projects/view/${item.project.id}`}
                                                startContent={<Eye className="size-5" />}>

                                            </Button>
                                            <Button
                                                color="danger"
                                                variant="shadow"
                                                className="rounded-md"
                                                isIconOnly
                                                onPress={() => {setCurrentItem(item);setDeleteOpen(true)}}
                                                startContent={<Trash className="size-5" />}>

                                            </Button>
                                        </div>
                                        : columnKey === "saleDate" ?
                                            <Chip size="sm" className="bg-foreground-200" radius="sm">
                                                {item.saleDate.toISOString().split("T")[0]}
                                            </Chip>
                                            : columnKey === "costs" ? (
                                                <Chip color="warning" variant="faded" radius="sm">
                                                    {item.project.price} $
                                                </Chip>
                                            ) : columnKey === "profit" ? (
                                                <Chip color={item.price - item.project.price > 0 ? "success" : "danger"} variant="flat">
                                                    {item.price - item.project.price} $
                                                </Chip>
                                            ) : getKeyValue(item, columnKey)
                            }</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <SaleAddModal open={addOpen} setOpen={setAddOpen} projects={projects} />
            <SaleDeleteModal open={deleteOpen} setOpen={setDeleteOpen} selectedSale={currentItem} />
        </div>
    );
};

export default SalesTable;
