'use client';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue, Input, Button, Selection, Tooltip, useDisclosure, Card, CardBody, CardHeader } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { Grid2x2Plus, Search, Trash2, Eye } from "lucide-react";
import CategoryAddModal from "./category-add-modal";
import CategoryDeleteModal from "./category-delete-modal";
import { Project } from "@/components/projects/projects-table";

export interface Category {
    id: number;
    name: string;
    numOfItems: number;
}

interface Column {
    key: keyof Category;
    label: string;
    isSortable: boolean;
}

interface SortDescriptor {
    column: keyof Category;
    direction: "ascending" | "descending";
}

const CategoriesTable = ({ items = [], projects = [] }: {
    items?: Category[],
    projects?: Project[]
}) => {

    const columns: Column[] = [
        { key: "name", label: "Category", isSortable: false },
        { key: "numOfItems", label: "Number Of Products", isSortable: true },
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
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [currentItem, setCurrentItem] = useState<Category>()

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <Input
                    startContent={<Search className="size-5" />}
                    isClearable
                    placeholder="Search for category..."
                    value={filterValue}
                    onClear={clear}
                    onValueChange={onSearchChange}
                />


                <Tooltip content="Add category" placement="top-end" showArrow>
                    <Button color="primary" isIconOnly startContent={<Grid2x2Plus className="size-5" />} onPress={() => {
                        setAddOpen(true)
                    }} />
                </Tooltip>
            </div>
            <Table
                aria-label="Categories table"
                color="primary"
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
                            {(columnKey) => columnKey === "id" ?
                                <TableCell>
                                    <Tooltip content="Delete category" color="danger" showArrow>
                                        <Button color="danger" variant="flat" isIconOnly startContent={<Trash2 className="size-5" />} onPress={() => {
                                            setCurrentItem(prev => prev === item ? undefined : item)
                                            setDeleteOpen(true)
                                        }} />
                                    </Tooltip>
                                </TableCell>
                                : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <CategoryAddModal open={addOpen} setOpen={setAddOpen} />
            <CategoryDeleteModal open={deleteOpen} setOpen={setDeleteOpen} category={currentItem} />
        </div>
    );
};

export default CategoriesTable;
