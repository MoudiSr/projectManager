'use client';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue, Input, Button, Selection, Tooltip, useDisclosure, Card, CardBody, CardHeader, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { Grid2x2Plus, Search, Trash2, Eye, User, UserPlus, EllipsisVertical } from "lucide-react";
import UserAddModal from "./accounts-add-modal";
import UserDeleteModal from "./accounts-delete-modal";
import UserEditModal from "./accounts-edit-modal";

export interface User {
    id: number;
    username: string;
    role: string;
}

interface Column {
    key: keyof User | string;
    label: string;
    isSortable: boolean;
}

interface SortDescriptor {
    column: keyof User;
    direction: "ascending" | "descending";
}

const AccountsTable = ({ items = [] }: {
    items?: User[]
}) => {

    const columns: Column[] = [
        { key: "id", label: "#", isSortable: true },
        { key: "username", label: "Username", isSortable: true },
        { key: "role", label: "Role", isSortable: true },
        { key: "actions", label: "Actions", isSortable: false }
    ];

    const [filterValue, setFilterValue] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);


    const filteredItems = useMemo(() => {
        return items.filter((item) =>
            item.username.toLowerCase().includes(filterValue.toLowerCase())
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
    const [editOpen, setEditOpen] = useState(false)

    const [currentItem, setCurrentItem] = useState<User>()

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <Input
                    startContent={<Search className="size-5" />}
                    isClearable
                    placeholder="Search for user..."
                    value={filterValue}
                    onClear={clear}
                    onValueChange={onSearchChange}
                />


                <Tooltip content="Add user" placement="top-end" showArrow>
                    <Button color="primary" isIconOnly startContent={<UserPlus className="size-5" />} onPress={() => {
                        setAddOpen(true)
                    }} />
                </Tooltip>
            </div>
            <Table
                aria-label="Users table"
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
                            {(columnKey) => columnKey === "role" ? (
                                <TableCell>
                                    <Chip color={getKeyValue(item, columnKey) === "admin" ? "danger" : getKeyValue(item, columnKey) === "editor" ? "warning" : "secondary"}>
                                        {getKeyValue(item, columnKey)}
                                    </Chip>
                                </TableCell>
                            ) : columnKey === "actions" ? (
                                <TableCell>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="faded">
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem key="edit" onPress={() => {setCurrentItem(item); setEditOpen(true)}}>
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem key="delete" onPress={() => {setCurrentItem(item); setDeleteOpen(true)}}>
                                                Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            ) : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <UserAddModal open={addOpen} setOpen={setAddOpen} />
            <UserDeleteModal open={deleteOpen} setOpen={setDeleteOpen} user={currentItem} />
            <UserEditModal open={editOpen} setOpen={setEditOpen} user={currentItem} />
        </div>
    );
};

export default AccountsTable;
